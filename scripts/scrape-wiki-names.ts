import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'

async function run() {
  console.log("Fetching Wikipedia page...")
  const res = await fetch('https://en.wikipedia.org/wiki/Road_signs_in_India')
  const html = await res.text()
  
  const $ = cheerio.load(html)
  const mapping: Record<string, string> = {}

  // In Wikipedia galleries, each item is often a li.gallerybox
  $('.gallerybox').each((i, el) => {
    // Find the image
    const img = $(el).find('img')
    if (!img) return
    let src = img.attr('src')
    if (!src) return
    
    // Extract the original filename from the src
    // src is usually like //upload.wikimedia.org/wikipedia/commons/thumb/x/y/Filename.svg/120px-Filename.svg.png
    let filenameMatch = src.match(/\/([^\/]+\.svg)/i)
    if (!filenameMatch) return
    
    let filename = filenameMatch[1]
    filename = decodeURIComponent(filename)
    
    // Find the caption
    const caption = $(el).find('.gallerytext').text().trim()
    
    if (caption) {
      // The local filename matches the transformed slug from download-signs.ts
      let slug = filename.replace('File:', '').toLowerCase()
      slug = slug.replace(/india_road_sign_/, '').replace(/india_/, '')
      slug = slug.replace(/_/g, '-').replace(/\s+/g, '-')
      
      mapping[slug] = caption.replace(/\n/g, ' ').trim()
    }
  })

  // Also check standard thumbnails (thumbinner)
  $('.thumbinner').each((i, el) => {
    const img = $(el).find('img')
    const src = img.attr('src')
    if (!src) return
    let filenameMatch = src.match(/\/([^\/]+\.svg)/i)
    if (!filenameMatch) return
    let filename = decodeURIComponent(filenameMatch[1])
    const caption = $(el).find('.thumbcaption').text().trim()
    if (caption) {
      let slug = filename.replace('File:', '').toLowerCase()
      slug = slug.replace(/india_road_sign_/, '').replace(/india_/, '')
      slug = slug.replace(/_/g, '-').replace(/\s+/g, '-')
      mapping[slug] = caption.replace(/\n/g, ' ').trim()
    }
  })

  console.log(`Found ${Object.keys(mapping).length} mappings from Wikipedia.`)
  fs.writeFileSync('wiki-mapping.json', JSON.stringify(mapping, null, 2))
}

run()
