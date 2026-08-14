import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Optimized for Neon serverless (pgbouncer transaction mode):
// - connection_limit=5: allow a small pool per lambda/server instance
// - pool_timeout=10: fail fast instead of hanging
// - connect_timeout=5: TCP connect fast-fail
// - pgbouncer=true: use pgbouncer statement cache if enabled on the Neon endpoint
const getOptimizedDbUrl = () => {
  const url = process.env.DATABASE_URL || ''
  if (!url) return url

  const params = new URLSearchParams()
  if (!url.includes('connection_limit=')) params.set('connection_limit', '5')
  if (!url.includes('pool_timeout=')) params.set('pool_timeout', '10')
  if (!url.includes('connect_timeout=')) params.set('connect_timeout', '5')

  const paramStr = params.toString()
  if (!paramStr) return url
  return url + (url.includes('?') ? '&' : '?') + paramStr
}

export const db = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: { url: getOptimizedDbUrl() }
  },
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
