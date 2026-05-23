import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCourses, saveCourses, Course } from '@/lib/data/academyStore'

// Middleware helper to check Admin role
async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'ADMIN') {
    return false
  }
  return true
}

export async function GET() {
  const isAuthorized = await checkAdminAuth()
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 })
  }
  return NextResponse.json(getCourses(), { status: 200 })
}

export async function POST(request: Request) {
  const isAuthorized = await checkAdminAuth()
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 })
  }

  try {
    const courseData = await request.json()
    const { title, tag, desc, price, category } = courseData

    if (!title || !tag || !desc || price === undefined || !category) {
      return NextResponse.json({ error: 'Missing mandatory course fields.' }, { status: 400 })
    }

    const currentCourses = getCourses()
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title,
      tag,
      desc,
      price: Number(price),
      category,
      active: courseData.active !== undefined ? courseData.active : true
    }

    currentCourses.push(newCourse)
    saveCourses(currentCourses)

    return NextResponse.json({ success: true, course: newCourse }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to create course.', details: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const isAuthorized = await checkAdminAuth()
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 })
  }

  try {
    const courseData = await request.json()
    const { id, title, tag, desc, price, category, active } = courseData

    if (!id) {
      return NextResponse.json({ error: 'Missing course ID.' }, { status: 400 })
    }

    const currentCourses = getCourses()
    const courseIndex = currentCourses.findIndex(c => c.id === id)

    if (courseIndex === -1) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 })
    }

    const updatedCourse = {
      ...currentCourses[courseIndex],
      ...(title && { title }),
      ...(tag && { tag }),
      ...(desc && { desc }),
      ...(price !== undefined && { price: Number(price) }),
      ...(category && { category }),
      ...(active !== undefined && { active })
    }

    currentCourses[courseIndex] = updatedCourse
    saveCourses(currentCourses)

    return NextResponse.json({ success: true, course: updatedCourse }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to update course.', details: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const isAuthorized = await checkAdminAuth()
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Forbidden. Admin credentials required.' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing course ID query parameter.' }, { status: 400 })
    }

    const currentCourses = getCourses()
    const filteredCourses = currentCourses.filter(c => c.id !== id)

    if (currentCourses.length === filteredCourses.length) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 })
    }

    saveCourses(filteredCourses)
    return NextResponse.json({ success: true, message: 'Course deleted successfully.' }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to delete course.', details: message }, { status: 500 })
  }
}
