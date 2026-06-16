const fs = require('fs');

const wikiData = JSON.parse(fs.readFileSync('./wiki-mapping.json', 'utf8'));
const dataFilePath = './lib/data/rto-data.ts';

let dataContent = fs.readFileSync(dataFilePath, 'utf8');

let newSigns = [];

for (const [filename, name] of Object.entries(wikiData)) {
    // Generate a basic category based on keywords
    let category = 'Signs';
    let nLower = name.toLowerCase();
    if (nLower.includes('park')) category = 'Parking';
    else if (nLower.includes('speed') || nLower.includes('limit')) category = 'Laws';
    else if (nLower.includes('warning') || nLower.includes('danger') || nLower.includes('hazard')) category = 'Emergencies';
    
    // Some mock data for meaning and rule
    let meaning = `This sign indicates: ${name}.`;
    let rule = `You must follow the rule for: ${name}.`;
    let imagePath = '';
    const dirs = ['information', 'mandatory', 'warning'];
    for (const dir of dirs) {
        if (fs.existsSync(`./public/images/signs/${dir}/${filename}`)) {
            imagePath = `/images/signs/${dir}/${filename}`;
            break;
        }
    }
    if (!imagePath) {
        console.log("Missing locally, skipping:", filename);
        continue;
    }

    let signKey = name.toLowerCase().replace(/[^a-z0-9]/g, '_');

    newSigns.push(`  { name: ${JSON.stringify(name)}, category: ${JSON.stringify(category)}, meaning: ${JSON.stringify(meaning)}, rule: ${JSON.stringify(rule)}, imagePath: ${JSON.stringify(imagePath)}, signKey: ${JSON.stringify(signKey)} }`);
}

const signsArrayString = `export const ROAD_SIGNS_DATA: RoadSignItem[] = [\n${newSigns.join(',\n')}\n];`;

// Replace the existing array
dataContent = dataContent.replace(/export const ROAD_SIGNS_DATA: RoadSignItem\[\] = \[[\s\S]*?\];/, signsArrayString);

fs.writeFileSync(dataFilePath, dataContent, 'utf8');
console.log('Successfully updated ROAD_SIGNS_DATA with ' + newSigns.length + ' signs.');
