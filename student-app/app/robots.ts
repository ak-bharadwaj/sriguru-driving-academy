import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard', '/profile', '/schedule', '/timeline', '/roadmap', '/learn', '/rto', '/badges', '/certificate', '/flashcards'],
    },
    sitemap: 'https://srigururto.vercel.app/sitemap.xml',
  }
}
