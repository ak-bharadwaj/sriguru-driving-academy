import fs from 'fs'
import path from 'path'

const SIGNS_ROOT = path.join(process.cwd(), 'public', 'images', 'signs')

// Load the wiki mapping
const WIKI_MAPPING_PATH = path.join(process.cwd(), 'wiki-mapping.json')
let wikiMapping: Record<string, string> = {}
if (fs.existsSync(WIKI_MAPPING_PATH)) {
  wikiMapping = JSON.parse(fs.readFileSync(WIKI_MAPPING_PATH, 'utf-8'))
}

function formatName(filename: string) {
  const mapped = wikiMapping[filename]
  if (mapped && mapped.length > 0) {
    return mapped
  }

  let name = filename.replace(/\.svg$/i, '')
  name = name.replace(/-sign-india/gi, '')
  name = name.replace(/-sign/gi, '')
  name = name.replace(/-india/gi, '')
  name = name.replace(/-/g, ' ')
  name = name.replace(/stop1/i, 'Stop')
  name = name.replace(/\b\w/g, l => l.toUpperCase())
  return name.trim()
}

function generateDynamicContent(name: string, category: string) {
  const lowerName = name.toLowerCase();
  
  let meaning = `Indicates ${name.toLowerCase()}.`;
  let steps = [
    `Identify the ${name} sign in advance.`,
    `Adjust your vehicle speed and position accordingly.`,
    `Comply with the traffic regulation to ensure safety.`
  ];

  if (lowerName.includes('speed limit')) {
    meaning = `Specifies the legal speed limit.`;
    steps = [
      `Check your speedometer immediately.`,
      `Adjust your speed to strictly match the limit.`,
      `Maintain a steady speed for optimal traffic flow.`
    ];
  } else if (lowerName.includes('pedestrian') || lowerName.includes('children') || lowerName.includes('school')) {
    meaning = `Warns of pedestrians or children near the road.`;
    steps = [
      `Reduce speed immediately and prepare to stop.`,
      `Scan the sides of the road continuously.`,
      `Always yield the right of way to pedestrians.`
    ];
  } else if (lowerName.includes('prohibited') || lowerName.match(/\bno\b/)) {
    meaning = `Strictly forbids a specific action or vehicle type.`;
    steps = [
      `Recognize the absolute restriction immediately.`,
      `Do not perform the prohibited action under any circumstances.`,
      `Look for alternative routes if your vehicle type is prohibited.`
    ];
  } else if (lowerName.includes('curve') || lowerName.includes('bend') || lowerName.includes('hairpin')) {
    meaning = `Warns of a sharp curve or bend in the road ahead.`;
    steps = [
      `Reduce your speed before entering the curve.`,
      `Do not attempt to overtake other vehicles.`,
      `Keep firmly to your lane and avoid drifting.`
    ];
  } else if (lowerName.includes('parking') && !lowerName.match(/\bno\b/)) {
    meaning = `Indicates a designated area where parking is permitted.`;
    steps = [
      `Signal your intention to park well in advance.`,
      `Slow down and align your vehicle correctly.`,
      `Ensure you park within the marked lines and secure the vehicle.`
    ];
  } else if (lowerName.includes('hospital') || lowerName.includes('first aid')) {
    meaning = `Indicates nearby medical facilities.`;
    steps = [
      `Maintain a quiet zone—do not sound your horn.`,
      `Watch out for ambulances entering or exiting.`,
      `Proceed with caution to not disturb patients.`
    ];
  } else if (lowerName.includes('crossing') || lowerName.includes('railway')) {
    meaning = `Warns of an upcoming crossing (railway or animal).`;
    steps = [
      `Slow down and look both ways.`,
      `Listen for approaching trains if it's a railway crossing.`,
      `Never try to beat a train or animal across the tracks/road.`
    ];
  } else if (lowerName.includes('give way')) {
    meaning = `Requires you to yield to other traffic.`;
    steps = [
      `Slow down and prepare to stop if necessary.`,
      `Check for approaching traffic from the right and left.`,
      `Proceed only when the way is completely clear.`
    ];
  } else if (lowerName.includes('stop')) {
    meaning = `Requires a complete halt.`;
    steps = [
      `Come to a complete stop before the stop line.`,
      `Look left, right, and left again.`,
      `Proceed only when it is 100% safe to do so.`
    ];
  } else if (lowerName.includes('compulsory')) {
    meaning = `Mandates a specific direction or action.`;
    steps = [
      `Follow the arrow's direction exactly.`,
      `Do not attempt to turn in any other direction.`,
      `Signal your intent even though the turn is compulsory.`
    ];
  }

  return { meaning, steps }
}

function run() {
  const categories = ['mandatory', 'warning', 'information']
  const rtoSigns = []

  const categoryMap: any = {
    'mandatory': 'Rules',
    'warning': 'Signs',
    'information': 'Parking'
  }

  for (const cat of categories) {
    const folderPath = path.join(SIGNS_ROOT, cat)
    if (!fs.existsSync(folderPath)) continue
    
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.svg'))
    
    for (const file of files) {
      let signName = wikiMapping[file]

      if (!signName) {
        if (file.toLowerCase().startsWith('indian-road-sign') || file.toLowerCase().startsWith('1950') || file.toLowerCase().startsWith('1977')) {
          continue;
        }
      }

      signName = formatName(file)

      if (!signName || signName.trim() === '') {
         signName = 'Sign ' + Math.floor(Math.random() * 900)
      }

      const { meaning, steps } = generateDynamicContent(signName, categoryMap[cat])

      rtoSigns.push({
        name: signName,
        category: categoryMap[cat],
        meaning: meaning,
        steps: steps, // Changed from rule to steps
        imagePath: `/images/signs/${cat}/${file}`,
        fallbackShape: cat === 'warning' ? 'triangle' : cat === 'mandatory' ? 'circle' : 'square',
        fallbackColor: cat === 'warning' ? 'red' : 'blue'
      })
    }
  }

  rtoSigns.push(
    {
      name: 'Red Traffic Light',
      category: 'Signals',
      meaning: 'Requires a complete halt.',
      steps: [
        `Come to a complete stop before the stop line.`,
        `Wait patiently until the light turns green.`,
        `Do not inch forward while waiting.`
      ],
      fallbackShape: 'circle',
      fallbackColor: 'red'
    },
    {
      name: 'Green Traffic Light',
      category: 'Signals',
      meaning: 'Indicates you may proceed if safe.',
      steps: [
        `Check the intersection quickly to ensure it's clear.`,
        `Proceed at a steady, safe speed.`,
        `Watch out for vehicles running the red light on the cross street.`
      ],
      fallbackShape: 'circle',
      fallbackColor: 'green'
    }
  )

  const outputStr = `export const ROAD_SIGNS_DATA = ${JSON.stringify(rtoSigns, null, 2)};\n`
  
  const rtoDataPath = path.join(process.cwd(), 'lib', 'data', 'rto-data.ts')
  let content = fs.readFileSync(rtoDataPath, 'utf-8')
  
  // Also update interface if needed, but we will do that via a separate replacement
  const regex = /export const ROAD_SIGNS_DATA = (?:\[[\s\S]*?\]);\n/
  if (regex.test(content)) {
    content = content.replace(regex, outputStr)
    fs.writeFileSync(rtoDataPath, content)
    console.log(`Successfully updated ROAD_SIGNS_DATA with ${rtoSigns.length} items.`)
  } else {
    console.log("Could not find ROAD_SIGNS_DATA in rto-data.ts")
  }
}

run()
