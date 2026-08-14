"use client"

import React, { useState } from 'react'
import { Lightbulb, Plus, Trash2, Edit3, Tag } from 'lucide-react'

interface Idea {
  id: string
  text: string
  category: string
  timestamp: string
}

export function BrainstormWidget() {
  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: '1',
      text: 'Need to update the advanced course syllabus next month',
      category: 'Curriculum',
      timestamp: new Date().toLocaleDateString()
    },
    {
      id: '2',
      text: 'Schedule maintenance for fleet cars #4 and #7',
      category: 'Operations',
      timestamp: new Date().toLocaleDateString()
    }
  ])
  
  const [newIdea, setNewIdea] = useState('')
  const [category, setCategory] = useState('General')

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newIdea.trim()) return

    const idea: Idea = {
      id: Date.now().toString(),
      text: newIdea,
      category,
      timestamp: new Date().toLocaleDateString()
    }

    setIdeas([idea, ...ideas])
    setNewIdea('')
  }

  const handleDelete = (id: string) => {
    setIdeas(ideas.filter(idea => idea.id !== id))
  }

  return (
    <div className="bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-2xl p-6 flex flex-col gap-5 shadow-sm h-full max-h-[500px]">
      <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-500">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[rgb(var(--color-text-1))]">Brainstorm Board</h3>
            <p className="text-xs text-[rgb(var(--color-text-3))]">Capture ideas and operational notes</p>
          </div>
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-[rgb(var(--color-border))] text-[rgb(var(--color-text-2))] rounded-md">
          {ideas.length} Notes
        </span>
      </div>

      <form onSubmit={handleAddIdea} className="flex flex-col gap-3">
        <textarea
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          placeholder="What's on your mind?..."
          className="w-full bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20 text-[rgb(var(--color-text-1))] placeholder:text-slate-400"
        />
        <div className="flex gap-2">
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[rgb(var(--color-void))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text-2))] text-xs rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option>General</option>
            <option>Curriculum</option>
            <option>Operations</option>
            <option>Marketing</option>
          </select>
          <button 
            type="submit"
            disabled={!newIdea.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Save Note
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 flex flex-col gap-3">
        {ideas.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No notes yet. Start brainstorming!
          </div>
        ) : (
          ideas.map(idea => (
            <div key={idea.id} className="p-3 border border-[rgb(var(--color-border))] bg-slate-50/50 dark:bg-slate-800/20 rounded-xl group relative">
              <div className="flex justify-between items-start mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[rgb(var(--color-border))] text-[rgb(var(--color-text-2))]">
                  <Tag className="w-3 h-3" />
                  {idea.category}
                </span>
                <span className="text-[10px] text-slate-400">{idea.timestamp}</span>
              </div>
              <p className="text-sm text-[rgb(var(--color-text-2))] leading-relaxed">
                {idea.text}
              </p>
              
              {/* Hover actions */}
              <button 
                onClick={() => handleDelete(idea.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shadow-sm"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
