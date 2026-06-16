import React from 'react'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Trophy, Medal, Star, Flame } from 'lucide-react'

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions)
  const studentEmail = session?.user?.email

  let topStudents: any[] = []
  // Find current user's rank
  let myRank = -1
  let myStudent: any = null

  try {
    topStudents = await db.student.findMany({
      take: 10,
      orderBy: { xp: 'desc' },
      include: { user: true }
    })

    if (studentEmail) {
      const me = await db.user.findUnique({ where: { email: studentEmail }, include: { student: true } })
      if (me?.student) {
        myStudent = me.student
        const higherXPCount = await db.student.count({ where: { xp: { gt: me.student.xp } } })
        myRank = higherXPCount + 1
      }
    }
  } catch (err) {
    console.error("Failed to query leaderboard from DB:", err)
  }

  // Fallback mock data if database offline or empty
  if (topStudents.length === 0) {
    topStudents = [
      { id: 'm-1', xp: 950, level: 7, user: { name: 'Aditya Vardhan', email: 'aditya@demo.com' } },
      { id: 'm-2', xp: 820, level: 6, user: { name: 'Priya Sharma', email: 'priya@demo.com' } },
      { id: 'm-3', xp: 780, level: 5, user: { name: 'Nikhil Reddy', email: 'nikhil@demo.com' } },
      { id: 'm-4', xp: 640, level: 4, user: { name: 'Sneha Rao', email: 'sneha@demo.com' } },
      { id: 'm-5', xp: 580, level: 4, user: { name: 'Amit Verma', email: 'amit@demo.com' } },
      { id: 'm-6', xp: 490, level: 3, user: { name: 'Meera Nair', email: 'meera@demo.com' } },
      { id: 'm-7', xp: 420, level: 3, user: { name: 'Vikramjit Rathore', email: 'vikram@demo.com' } },
      { id: 'm-8', xp: 350, level: 2, user: { name: session?.user?.name || 'Gaurav Singh', email: studentEmail || 'student@demo.com' } },
      { id: 'm-9', xp: 290, level: 2, user: { name: 'Rohan Gupta', email: 'rohan@demo.com' } },
      { id: 'm-10', xp: 210, level: 1, user: { name: 'Divya Teja', email: 'divya@demo.com' } },
    ]
    myRank = 8
    myStudent = {
      id: 'm-8',
      xp: 350,
      level: 2
    }
  }

  const top3 = topStudents.slice(0, 3)
  const others = topStudents.slice(3)

  // Reorder top 3 for podium: [2nd, 1st, 3rd]
  const podium = [
    top3[1] || null,
    top3[0] || null,
    top3[2] || null
  ]

  return (
    <div className="min-h-screen bg-void text-text-1 pt-24 pb-32 px-4 md:px-6 overflow-x-hidden font-body">
      {/* Decorative Background */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col gap-12 relative z-10">
        <header className="text-center flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20 mb-2">
            <Trophy className="w-8 h-8 text-accent drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display text-white">
            Global Rankings
          </h1>
          <p className="text-text-3 max-w-md mx-auto">Compete with other cadets. Earn XP by completing modules and passing mock exams.</p>
        </header>

        {/* PODIUM */}
        {top3.length > 0 && (
          <div className="flex justify-center items-end h-[320px] gap-2 md:gap-6 mt-8">
            {podium.map((stu, idx) => {
              if (!stu) return <div key={idx} className="w-[100px] md:w-[140px]" />
              
              const isFirst = idx === 1
              const isSecond = idx === 0
              const isThird = idx === 2
              
              const heightClass = isFirst ? 'h-[200px]' : isSecond ? 'h-[150px]' : 'h-[120px]'
              const colorClass = isFirst ? 'bg-gradient-to-t from-amber-500/20 to-amber-400/5 border-amber-500/50' : 
                                 isSecond ? 'bg-gradient-to-t from-slate-400/20 to-slate-300/5 border-slate-400/50' : 
                                 'bg-gradient-to-t from-amber-700/20 to-amber-600/5 border-amber-700/50'
              const textGlow = isFirst ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' :
                               isSecond ? 'text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]' :
                               'text-amber-600 drop-shadow-[0_0_8px_rgba(180,83,9,0.6)]'

              return (
                <div key={stu.id} className="flex flex-col items-center w-[100px] md:w-[140px] relative">
                  {/* Avatar & Info */}
                  <div className={`flex flex-col items-center mb-4 relative ${isFirst ? '-translate-y-4' : ''}`}>
                    {isFirst && <div className="absolute -top-8 text-amber-400 animate-bounce"><Trophy className="w-6 h-6" /></div>}
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface border-4 flex items-center justify-center shadow-xl ${isFirst ? 'border-amber-400' : isSecond ? 'border-slate-400' : 'border-amber-700'}`}>
                      <User className={`w-8 h-8 ${isFirst ? 'text-amber-400' : isSecond ? 'text-slate-400' : 'text-amber-700'}`} />
                    </div>
                    <span className="font-bold text-sm md:text-base mt-3 text-center line-clamp-1">{stu.user.name}</span>
                    <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full mt-1">{stu.xp} XP</span>
                  </div>

                  {/* Podium Pillar */}
                  <div className={`w-full ${heightClass} ${colorClass} border-t-4 rounded-t-xl flex justify-center pt-4 relative overflow-hidden backdrop-blur-sm`}>
                    <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay" />
                    <span className={`text-4xl md:text-6xl font-black font-display opacity-40 ${textGlow}`}>
                      {isFirst ? '1' : isSecond ? '2' : '3'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Current User Stats Bar */}
        {myRank > 0 && myStudent && (
          <div className="bg-primary/10 border border-primary/30 rounded-2xl p-5 flex items-center justify-between shadow-[0_0_30px_rgba(37,99,235,0.1)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black text-xl font-display shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                {myRank}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg tracking-tight">Your Current Rank</span>
                <span className="text-xs text-primary font-medium tracking-wide">Keep learning to climb higher!</span>
              </div>
            </div>
            <div className="text-right flex flex-col">
              <span className="font-mono text-2xl font-bold text-white flex items-center justify-end gap-1"><Flame className="w-5 h-5 text-accent" /> {myStudent.xp}</span>
              <span className="text-xs text-text-3 font-mono">LEVEL {myStudent.level}</span>
            </div>
          </div>
        )}

        {/* Rest of the List */}
        <div className="flex flex-col gap-3">
          {others.map((stu, i) => {
            const rank = i + 4
            const isMe = stu.user.email === studentEmail
            return (
              <div key={stu.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${isMe ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'bg-surface border-border/50 hover:border-border hover:bg-surface/80'}`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-void border border-border/50 text-text-3 shadow-inner">
                  {rank}
                </div>
                
                <div className="w-10 h-10 rounded-full bg-border/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-text-3" />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <span className={`font-bold flex items-center gap-2 ${isMe ? 'text-primary' : 'text-text-1'}`}>
                    {stu.user.name} {isMe && <span className="text-[9px] bg-primary text-white px-2 py-0.5 rounded uppercase tracking-widest font-bold">You</span>}
                  </span>
                  <span className="text-xs text-text-3 font-mono">Level {stu.level}</span>
                </div>
                
                <div className="text-right flex flex-col items-end">
                  <span className="font-mono font-bold text-text-1 flex items-center gap-1.5 text-lg">
                    {stu.xp} <Star className="w-4 h-4 text-accent fill-accent/20" />
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

function User(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
