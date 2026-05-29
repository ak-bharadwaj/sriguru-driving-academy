import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// For serverless environments (Vercel), aggressively restrict the connection pool to 1 per instance
// to prevent exhausting Neon DB's 60 connection limit during traffic spikes.
const getOptimizedDbUrl = () => {
  const url = process.env.DATABASE_URL || ''
  if (!url) return url
  if (url.includes('connection_limit=')) return url
  return url + (url.includes('?') ? '&' : '?') + 'connection_limit=1'
}

export const db = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: { url: getOptimizedDbUrl() }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
