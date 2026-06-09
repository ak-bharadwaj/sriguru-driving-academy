import { useState, useEffect, useRef } from 'react'

export interface AppNotification {
  id: string
  type: string
  title: string
  message: string
  time: string
  read: boolean
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const prevNotificationsRef = useRef<string[]>([])
  const isFirstLoad = useRef(true)

  // Request browser permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission)
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((perm) => {
          setPermission(perm)
        })
      }
    }
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data: AppNotification[] = await res.json()
        setNotifications(data)
        
        const unread = data.filter(n => !n.read)
        setUnreadCount(unread.length)

        // Find newly added notifications that are unread
        const currentIds = data.map(n => n.id)
        if (!isFirstLoad.current && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          unread.forEach(n => {
            if (!prevNotificationsRef.current.includes(n.id)) {
              new Notification(n.title, {
                body: n.message,
                icon: '/favicon.ico',
                tag: n.id
              })
            }
          })
        }

        prevNotificationsRef.current = currentIds
        isFirstLoad.current = false
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    }
  }

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Poll notifications every 60 seconds (only when the tab is visible and active)
  useEffect(() => {
    fetchNotifications()

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      } else {
        fetchNotifications()
        if (!intervalRef.current) {
          intervalRef.current = setInterval(fetchNotifications, 60000)
        }
      }
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange)
    }

    intervalRef.current = setInterval(fetchNotifications, 60000)

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications?action=read-all', { method: 'PATCH' })
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications?id=${id}`, { method: 'PATCH' })
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return {
    notifications,
    unreadCount,
    permission,
    requestPermission: async () => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        const perm = await Notification.requestPermission()
        setPermission(perm)
        return perm
      }
      return 'default'
    },
    markAllAsRead,
    markAsRead,
    refresh: fetchNotifications
  }
}
