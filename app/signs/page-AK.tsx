import fs from 'fs/promises'
import path from 'path'
import React from 'react'
import SignsClient from './SignsClient'

export const metadata = {
  title: 'Interactive Road Signs | Sri Guru Driving Academy',
  description: 'Interactive material design flashcards for learning RTO road signs.',
}

export default async function SignsPage() {
  const signsDir = path.join(process.cwd(), 'public', 'signs')
  let files: string[] = []
  try {
    files = await fs.readdir(signsDir)
    // Filter out non-svg files if any exist
    files = files.filter(f => f.endsWith('.svg'))
  } catch (err) {
    files = []
  }

  return <SignsClient files={files} />
}
