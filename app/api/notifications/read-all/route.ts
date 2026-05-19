import { NextResponse } from 'next/server'

export async function PATCH() {
  try {
    console.log('All notifications marked as read')
    return NextResponse.json({ success: true, message: 'All marked read' }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Notification bulk update failed' }, { status: 500 })
  }
}
