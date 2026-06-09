"use client"

import React, { useState } from 'react'
import { Check, Mail, Phone, Clock, Search, MessageSquare } from 'lucide-react'

type Inquiry = {
  id: string
  name: string
  phone: string
  email: string | null
  message: string
  createdAt: Date
  resolved: boolean
}

export default function EnquiriesClient({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('pending')
  const [search, setSearch] = useState('')

  // Sync state if server component re-fetches
  React.useEffect(() => {
    setInquiries(initialInquiries)
  }, [initialInquiries])

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}/resolve`, {
        method: 'POST'
      })
      if (res.ok) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, resolved: true } : inq))
      }
    } catch (e) {
      console.error('Failed to resolve inquiry')
    }
  }

  const filteredInquiries = inquiries.filter(inq => {
    if (filter === 'pending' && inq.resolved) return false
    if (filter === 'resolved' && !inq.resolved) return false
    if (search && !inq.name.toLowerCase().includes(search.toLowerCase()) && !inq.email?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[rgb(var(--color-surface))] p-4 rounded-xl border border-[rgb(var(--color-border))]">
        <div className="flex bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-lg p-1">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-1))] shadow' : 'text-[rgb(var(--color-text-3))] hover:text-[rgb(var(--color-text-2))]'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-1))] shadow' : 'text-[rgb(var(--color-text-3))] hover:text-[rgb(var(--color-text-2))]'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('resolved')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'resolved' ? 'bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-1))] shadow' : 'text-[rgb(var(--color-text-3))] hover:text-[rgb(var(--color-text-2))]'}`}
          >
            Resolved
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-3))]" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text-1))] focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInquiries.length === 0 ? (
          <div className="col-span-full py-14 text-center border border-dashed border-[rgb(var(--color-border))] rounded-2xl bg-[rgb(var(--color-surface))] flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] flex items-center justify-center text-[rgb(var(--color-text-3))]">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-base font-bold text-[rgb(var(--color-text-1))]">No enquiries found</p>
              <p className="text-sm text-[rgb(var(--color-text-3))]">Incoming contact requests will appear here.</p>
            </div>
          </div>
        ) : (
          filteredInquiries.map(inquiry => (
            <div key={inquiry.id} className={`bg-[rgb(var(--color-surface))] border rounded-2xl p-6 flex flex-col gap-4 shadow-sm transition-all duration-200 hover:shadow-md ${inquiry.resolved ? 'border-[rgb(var(--color-border))] opacity-70' : 'border-blue-500/30 dark:border-blue-500/20 shadow-blue-500/5'}`}>
              
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-lg text-[rgb(var(--color-text-1))]">{inquiry.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-3))] mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(inquiry.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                {inquiry.resolved ? (
                  <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Resolved
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full">
                    Pending
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 py-3 border-y border-[rgb(var(--color-border))]">
                <div className="flex items-center gap-3 text-sm text-[rgb(var(--color-text-2))]">
                  <Phone className="w-4 h-4 text-[rgb(var(--color-text-3))]" />
                  <a href={`tel:${inquiry.phone}`} className="hover:text-blue-500 transition-colors">{inquiry.phone}</a>
                </div>
                {inquiry.email && (
                  <div className="flex items-center gap-3 text-sm text-[rgb(var(--color-text-2))]">
                    <Mail className="w-4 h-4 text-[rgb(var(--color-text-3))]" />
                    <a href={`mailto:${inquiry.email}`} className="hover:text-blue-500 transition-colors">{inquiry.email}</a>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm text-[rgb(var(--color-text-2))] whitespace-pre-wrap">{inquiry.message}</p>
              </div>

              {!inquiry.resolved && (
                <button 
                  onClick={() => handleResolve(inquiry.id)}
                  className="mt-2 w-full py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium text-sm rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Mark as Resolved
                </button>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  )
}
