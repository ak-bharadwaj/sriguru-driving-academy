import { db } from '@/lib/db'
import EnquiriesClient from './EnquiriesClient'

export const dynamic = 'force-dynamic'

export default async function EnquiriesPage() {
  let inquiries: any[] = []
  try {
    inquiries = await db.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (err) {
    console.error("Failed to fetch enquiries from DB:", err)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[rgb(var(--color-text-1))]">Enquiries</h1>
          <p className="text-[rgb(var(--color-text-3))]">Manage incoming questions and contact requests.</p>
        </div>
      </div>
      
      <EnquiriesClient initialInquiries={inquiries} />
    </div>
  )
}
