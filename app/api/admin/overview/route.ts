export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    // 0. Security Audit check: verify ADMIN role in active session
    const session = await getServerSession(authOptions)
    const user = session?.user as { role?: string } | undefined
    if (!session || user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '5')
    const skip = (page - 1) * limit

    interface DBStudent {
      id: string
      level: number
      xp: number
      trainingType: string
      user: {
        name: string | null
        email: string | null
      }
    }
    interface DBBooking {
      id: string
      name: string
      email: string
      phone: string
      trainingType: string
      status: string
      createdAt: Date
    }

    let studentCount = 0
    let sessionCount = 0
    let databaseStudents: DBStudent[] = []
    let databaseBookings: DBBooking[] = []
    let fetchedActivityLog: any = null
    let fetchedRevenue = 0

    // Fetch statistics and datasets concurrently from real database tables
    // (Removed unused instructor.count and booking.count queries to optimize Neon usage)
    const [
      sCount,
      sessCount,
      dbStudents,
      dbBookings,
      revenueAgg,
      dbNotifications
    ] = await Promise.all([
      db.student.count(),
      db.session.count(),
      db.student.findMany({
        select: {
          id: true,
          level: true,
          xp: true,
          trainingType: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { xp: 'desc' },
        take: limit,
        skip: skip
      }),
      db.booking.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          trainingType: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      }),
      db.payment.aggregate({
        _sum: { amount: true }
      }),
      db.notification.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, type: true, message: true, createdAt: true }
      })
    ])

    studentCount = sCount
    sessionCount = sessCount
    databaseStudents = dbStudents as unknown as DBStudent[]
    databaseBookings = dbBookings as unknown as DBBooking[]
    
    const realActivityLog = dbNotifications.map(n => ({
      id: n.id,
      timestamp: n.createdAt.toTimeString().split(' ')[0],
      type: n.type,
      text: n.message
    }))
    
    const totalRevenue = revenueAgg._sum.amount || 0

    fetchedActivityLog = realActivityLog
    fetchedRevenue = totalRevenue

    // Group bookings into dynamic Kanban columns
    const bookingPipeline = {
      pending: databaseBookings.filter(b => b.status === 'PENDING').slice(0, 4),
      approved: databaseBookings.filter(b => b.status === 'APPROVED').slice(0, 4),
      completed: databaseBookings.filter(b => b.status === 'COMPLETED' || b.status === 'REJECTED').slice(0, 4)
    }

    const recentActivityLog = fetchedActivityLog || []

    return NextResponse.json({
      health: {
        activeStudents: studentCount,
        sessionsToday: sessionCount,
        pendingBookings: databaseBookings.filter(b => b.status === 'PENDING').length,
        totalRevenue: fetchedRevenue
      },
      topStudents: databaseStudents.map(s => ({
        id: s.id,
        name: s.user.name,
        email: s.user.email,
        level: s.level,
        xp: s.xp,
        license: s.trainingType === 'RTO_FAST_TRACK' ? 'RTO' : s.trainingType
      })),
      bookingPipeline,
      enrollmentSparkline: [],
      instructorUtilization: [],
      attendanceHeatmap: [],
      recentActivityLog,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(studentCount / limit) || 1,
        totalItems: studentCount
      }
    }, {
      status: 200,
      headers: { 'Cache-Control': 'private, max-age=15, stale-while-revalidate=60' }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Admin Analytics route Error:', error)
    return NextResponse.json({ error: 'Analytics retrieval failed', details: message }, { status: 500 })
  }
}
