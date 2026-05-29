"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const HIDE_ON_PREFIXES = [
  '/student',
  '/instructor',
  '/admin',
  '/dashboard',
]

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi there! 👋 I am your virtual assistant. You can ask me RTO questions or ask to see your progress!'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { academyName } = useSettingsStore()
  const pathname = usePathname()
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput('')
    
    // Add user message to UI
    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: userMsg }
    setMessages(prev => [...prev, newMsg])
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      })
      const data = await res.json()

      setMessages(prev => [
        ...prev, 
        { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply }
      ])
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Oops! I am having trouble connecting right now.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // A very simple Markdown Link Parser
  // Converts [Text](/url) to an anchor tag styled like a button
  const renderMessageContent = (content: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = linkRegex.exec(content)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index))
      }
      
      // Add the link
      parts.push(
        <Link 
          key={match.index} 
          href={match[2]}
          onClick={() => setIsOpen(false)} // close chat on navigation
          className="inline-block mt-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary font-semibold rounded-lg text-xs transition-colors"
        >
          {match[1]}
        </Link>
      )
      
      lastIndex = linkRegex.lastIndex
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex))
    }

    return parts.length > 0 ? parts : content
  }

  // Hide on all portal routes — avoids overlapping bottom nav bars
  const shouldHide = HIDE_ON_PREFIXES.some(p => pathname.startsWith(p))
  if (shouldHide) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-surface border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-void border-b border-border p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-text-1 text-sm tracking-tight">{academyName} AI</h3>
                  <p className="text-[10px] text-primary uppercase font-mono tracking-wider font-bold">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full text-text-3 hover:text-text-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-primary text-white' : 'bg-white/10 text-text-2'
                  }`}>
                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white/5 border border-border text-text-1 rounded-tl-none'
                  }`}>
                    {renderMessageContent(msg.content)}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="w-6 h-6 shrink-0 rounded-full bg-white/10 text-text-2 flex items-center justify-center">
                    <Bot className="w-3 h-3" />
                  </div>
                  <div className="p-4 rounded-2xl rounded-tl-none bg-white/5 border border-border flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-text-3 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-text-3 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-text-3 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-void border-t border-border shrink-0">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text-1 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-11 h-11 shrink-0 bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                </button>
              </form>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] transition-shadow"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}

    </div>
  )
}
