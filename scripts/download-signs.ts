import fs from 'fs'
import path from 'path'
import axios from 'axios'

const API_BASE = 'https://commons.wikimedia.org/w/api.php'
const OUT_ROOT = path.join(process.cwd(), 'public', 'images', 'signs')

axios.defaults.headers.common['User-Agent'] = 'SriGuruDrivingAcademy/1.0 (contact@sriguru.in)'

// Map category names to target folders
const CATEGORY_MAP = [
  { name: 'Category:SVG_mandatory_road_signs_of_India', folder: 'mandatory' },
  { name: 'Category:SVG_prohibitory_road_signs_of_India', folder: 'mandatory' },
  { name: 'Category:SVG_regulatory_road_signs_of_India', folder: 'mandatory' },
  { name: 'Category:SVG_priority_road_signs_of_India', folder: 'mandatory' },
  { name: 'Category:SVG_warning_road_signs_of_India', folder: 'warning' },
  { name: 'Category:SVG_information_road_signs_of_India', folder: 'information' },
  { name: 'Category:SVG_road_signs_in_India', folder: 'information' } // fallback/general
]

// Robust request helper with retries for 429/5xx errors
async function fetchWithRetry(url: string, params: any = {}, retries = 3, delay = 5000): Promise<any> {
  try {
    const response = await axios.get(url, { ...params, responseType: params.responseType || 'json' })
    return response
  } catch (err: any) {
    if (retries > 0 && (err.response?.status === 429 || err.response?.status >= 500)) {
      console.warn(`[API Warning] Received status ${err.response?.status}. Retrying in ${delay}ms... (${retries} retries left)`)
      await new Promise(r => setTimeout(r, delay))
      return fetchWithRetry(url, params, retries - 1, delay * 1.5)
    }
    throw err;
  }
}

async function getCategoryMembers(category: string): Promise<string[]> {
  let files: string[] = []
  let cmcontinue: string | undefined = undefined

  do {
    try {
      const res: any = await fetchWithRetry(API_BASE, {
        params: {
          action: 'query',
          list: 'categorymembers',
          cmtitle: category,
          cmlimit: 'max',
          format: 'json',
          cmcontinue: cmcontinue
        }
      })
      
      const members = res.data?.query?.categorymembers || []
      files.push(...members.map((m: any) => m.title).filter((title: string) => title.startsWith('File:') && title.toLowerCase().endsWith('.svg')))
      
      cmcontinue = res.data?.continue?.cmcontinue
    } catch (err: any) {
      console.error(`Failed to fetch category members for ${category}: ${err.message}`)
      break
    }
  } while (cmcontinue)

  return files
}

async function main() {
  console.log('Starting comprehensive SVG extraction for Indian RTO signs...')
  
  let totalSuccess = 0
  let totalSkip = 0
  let totalFail = 0

  for (const catConfig of CATEGORY_MAP) {
    const targetDir = path.join(OUT_ROOT, catConfig.folder)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    console.log(`\nProcessing ${catConfig.name} -> public/images/signs/${catConfig.folder}...`)
    const files = await getCategoryMembers(catConfig.name)
    console.log(`Found ${files.length} SVG files. Downloading...`)

    for (let i = 0; i < files.length; i++) {
      const title = files[i]
      
      // Clean up slug name
      let slug = title.replace('File:', '').toLowerCase()
      slug = slug.replace(/india_road_sign_/, '').replace(/india_/, '')
      slug = slug.replace(/_/g, '-').replace(/\s+/g, '-')
      
      const filePath = path.join(targetDir, slug)

      // Skip if already exists
      if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
        totalSkip++
        continue
      }

      try {
        const infoRes: any = await fetchWithRetry(API_BASE, {
          params: {
            action: 'query',
            titles: title,
            prop: 'imageinfo',
            iiprop: 'url',
            format: 'json'
          }
        })
        
        const pages = infoRes.data?.query?.pages
        const pageId = Object.keys(pages)[0]
        const url = pages[pageId]?.imageinfo?.[0]?.url
        
        if (!url) {
          console.warn(`[${i+1}/${files.length}] No URL found for ${title}`)
          totalFail++
          continue
        }
        
        // Download the raw SVG content
        const svgRes: any = await fetchWithRetry(url, { responseType: 'text' })
        fs.writeFileSync(filePath, svgRes.data)
        console.log(`[${i+1}/${files.length}] Downloaded to ${catConfig.folder}/${slug}`)
        totalSuccess++
        
        // Sleep 800ms between downloads to play nice with Wikimedia CDN
        await new Promise(r => setTimeout(r, 800))
      } catch (err: any) {
        console.error(`[${i+1}/${files.length}] Failed to download ${title}: ${err.message}`)
        totalFail++
      }
    }
  }

  console.log(`\nComprehensive Extraction Complete!`)
  console.log(`Successfully downloaded: ${totalSuccess}`)
  console.log(`Skipped (already exists): ${totalSkip}`)
  console.log(`Failed: ${totalFail}`)
}

main().catch(console.error)
