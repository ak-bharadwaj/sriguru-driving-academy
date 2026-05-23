import { NextResponse } from 'next/server'
import { getBranding, saveBranding } from '@/lib/data/academyStore'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const branding = getBranding()
    return NextResponse.json(branding)
  } catch (error) {
    console.error("Failed to fetch branding:", error)
    return NextResponse.json({ error: "Failed to fetch branding" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const currentBranding = getBranding()
    const newBranding = { ...currentBranding, ...body }
    
    saveBranding(newBranding)
    
    return NextResponse.json(newBranding)
  } catch (error) {
    console.error("Failed to save branding:", error)
    return NextResponse.json({ error: "Failed to save branding" }, { status: 500 })
  }
}
