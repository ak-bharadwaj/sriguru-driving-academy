import { NextResponse } from 'next/server'

// Resilient server-side memory for cadet notifications
let localNotifications: any[] = [
  {
    id: 'notif-1',
    type: 'SESSION_REMINDER',
    message: 'Scheduled LMV trial session with Harpreet Singh starts in 2 hours.',
    time: '2 hours ago',
    read: false
  },
  {
    id: 'notif-2',
    type: 'BADGE_EARNED',
    message: 'Unlocked "Clutch Overlord" badge for maintaining 90% friction precision.',
    time: '5 hours ago',
    read: false
  },
  {
    id: 'notif-3',
    type: 'FEEDBACK_RECEIVED',
    message: 'Coaching commentary published: "Excellent steering lock holding angles during reverse bays."',
    time: '1 day ago',
    read: false
  },
  {
    id: 'notif-4',
    type: 'STREAK_AT_RISK',
    message: 'Streak at risk! Complete 1 signs mock quiz to maintain your 5-day streak.',
    time: '2 days ago',
    read: true
  }
]

export async function GET() {
  try {
    // Sort unread first, max 20
    const sorted = [...localNotifications]
      .sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1))
      .slice(0, 20)

    return NextResponse.json(sorted, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve notifications' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')

    if (action === 'read-all') {
      // Mark all read
      localNotifications = localNotifications.map(n => ({ ...n, read: true }))
      return NextResponse.json({ success: true, message: 'All notifications marked as read' }, { status: 200 })
    }

    if (id) {
      // Mark single notification read
      localNotifications = localNotifications.map(n => {
        if (n.id === id) return { ...n, read: true }
        return n
      })
      return NextResponse.json({ success: true, id }, { status: 200 })
    }

    return NextResponse.json({ error: 'Missing mandatory action or id parameters' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Notification update failed' }, { status: 500 })
  }
}
