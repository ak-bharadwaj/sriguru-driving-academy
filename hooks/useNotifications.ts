import { useState, useEffect, useRef, useCallback } from 'react'

export interface AppNotification {
  id: string
  type: string
  title: string
  message: string
  time: string
  read: boolean
}

// ─── Module-level singleton cache ────────────────────────────────────────────
// Shared across all consumers so navigation never re-fires a fresh fetch.
let _notifications: AppNotification[] = []
let _unreadCount = 0
let _listeners: Array<() => void> = []
let _intervalId: ReturnType<typeof setInterval> | null = null
let _isFetching = false
let _lastFetchedAt = 0
const POLL_INTERVAL_MS = 90_000       // poll every 90 s (was 60 s per-instance)
const DEBOUNCE_MS = 5_000             // don't re-fetch if we fetched < 5 s ago

function notifyListeners() {
  _listeners.forEach((fn) => fn())
}

async function _fetchOnce() {
  if (_isFetching) return
  const now = Date.now()
  if (now - _lastFetchedAt < DEBOUNCE_MS) return  // already fresh
  _isFetching = true
  try {
    const res = await fetch('/api/notifications')
    if (!res.ok) return
    const data: AppNotification[] = await res.json()

    // Fire browser push-notifications only for newly arrived unread items
    const prevIds = new Set(_notifications.map((n) => n.id))
    const newUnread = data.filter((n) => !n.read && !prevIds.has(n.id))
    if (
      newUnread.length > 0 &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted' &&
      _lastFetchedAt > 0  // skip on very first load
    ) {
      newUnread.forEach((n) => {
        new Notification(n.title, { body: n.message, icon: '/favicon.ico', tag: n.id })
      })
    }

    _notifications = data
    _unreadCount = data.filter((n) => !n.read).length
    _lastFetchedAt = now
    notifyListeners()
  } catch {
    // Silently swallow — never block navigation
  } finally {
    _isFetching = false
  }
}

function _startPolling() {
  if (_intervalId !== null) return  // already running
  _intervalId = setInterval(() => {
    if (!document.hidden) _fetchOnce()
  }, POLL_INTERVAL_MS)
}

function _stopPolling() {
  if (_intervalId !== null) {
    clearInterval(_intervalId)
    _intervalId = null
  }
}

// ─── The hook — just subscribes to the shared state ──────────────────────────
export function useNotifications() {
  const [, forceUpdate] = useState(0)
  const mounted = useRef(true)

  const subscribe = useCallback(() => {
    const listener = () => { if (mounted.current) forceUpdate((n) => n + 1) }
    _listeners.push(listener)
    return () => { _listeners = _listeners.filter((l) => l !== listener) }
  }, [])

  useEffect(() => {
    mounted.current = true
    const unsub = subscribe()

    // Request push permission once
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Kick off polling singleton + initial fetch (debounced so it's a no-op if recent)
    _startPolling()
    _fetchOnce()

    // Pause polling when tab hidden, resume on focus
    const onVisibility = () => {
      if (document.hidden) { _stopPolling() } else { _startPolling(); _fetchOnce() }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      mounted.current = false
      unsub()
      document.removeEventListener('visibilitychange', onVisibility)
      // Keep polling alive — other layouts still need it
      // Polling stops only when zero listeners remain
      if (_listeners.length === 0) _stopPolling()
    }
  }, [subscribe])

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?action=read-all', { method: 'PATCH' })
      if (res.ok) {
        _notifications = _notifications.map((n) => ({ ...n, read: true }))
        _unreadCount = 0
        notifyListeners()
      }
    } catch {}
  }, [])

  const markAsRead = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/notifications?id=${id}`, { method: 'PATCH' })
      if (res.ok) {
        _notifications = _notifications.map((n) => n.id === id ? { ...n, read: true } : n)
        _unreadCount = Math.max(0, _unreadCount - 1)
        notifyListeners()
      }
    } catch {}
  }, [])

  return {
    notifications: _notifications,
    unreadCount: _unreadCount,
    permission: typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default' as NotificationPermission,
    markAllAsRead,
    markAsRead,
    refresh: _fetchOnce,
  }
}
