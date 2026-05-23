import React from 'react'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Trophy, Medal, Star } from 'lucide-react'



export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions)
  const studentEmail = session?.user?.email

  const topStudents = await db.student.findMany({
    take: 10,
    orderBy: { xp: 'desc' },
    include: { user: true }
  })

  // Find current user's rank
  let myRank = -1
  let myStudent = null
  
  if (studentEmail) {
    const me = await db.user.findUnique({ where: { email: studentEmail }, include: { student: true } })
    if (me?.student) {
      myStudent = me.student
      const higherXPCount = await db.student.count({ where: { xp: { gt: me.student.xp } } })
      myRank = higherXPCount + 1
    }
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-void))] text-[rgb(var(--color-text-1))] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <header className="flex flex-col gap-2 border-b border-[rgb(var(--color-border))]/60 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight font-display flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" /> Academy Leaderboard
          </h1>
          <p className="text-sm text-[rgb(var(--color-text-2))]">Top 10 students by XP this week.</p>
        </header>

        {myRank > 0 && myStudent && (
          <div className="bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/30 rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-[rgb(var(--color-primary))]/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[rgb(var(--color-primary))] text-white flex items-center justify-center font-bold text-xl">
                #{myRank}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[rgb(var(--color-text-1))]">Your Current Rank</span>
                <span className="text-xs text-[rgb(var(--color-text-3))]">Keep learning to climb higher!</span>
              </div>
            </div>
            <div className="text-right flex flex-col">
              <span className="font-mono text-xl font-bold text-[rgb(var(--color-primary))]">{myStudent.xp} XP</span>
              <span className="text-xs text-[rgb(var(--color-text-3))]">Level {myStudent.level}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {topStudents.map((stu, i) => {
            const isMe = stu.user.email === studentEmail
            return (
              <div key={stu.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isMe ? 'bg-[rgb(var(--color-surface))] border-[rgb(var(--color-primary))]' : 'bg-[rgb(var(--color-void))] border-[rgb(var(--color-border))]/50 hover:border-[rgb(var(--color-border))]'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]' : i === 1 ? 'bg-slate-300 text-slate-800' : i === 2 ? 'bg-amber-700 text-white' : 'bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-2))]'}`}>
                  {i === 0 ? <Medal className="w-5 h-5" /> : `#${i + 1}`}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <span className="font-bold text-[rgb(var(--color-text-1))] flex items-center gap-2">
                    {stu.user.name} {isMe && <span className="text-[9px] bg-[rgb(var(--color-primary))] text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wider">You</span>}
                  </span>
                  <span className="text-xs text-[rgb(var(--color-text-3))] font-mono">Level {stu.level}</span>
                </div>
                
                <div className="text-right flex flex-col items-end">
                  <span className="font-mono font-bold text-[rgb(var(--color-text-1))] flex items-center gap-1.5">
                    {stu.xp} <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
