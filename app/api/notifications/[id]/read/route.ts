import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    console.log(`Notification ${id} marked as read`)
    return NextResponse.json({ success: true, id }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Notification update failed' }, { status: 500 })
  }
}
