const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, '../public/signs');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// These are exact Wikimedia Commons URLs for Indian Road Signs
const signs = [
  { name: 'mandatory-stop.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/India_road_sign_R1.svg' },
  { name: 'mandatory-give-way.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/India_road_sign_R2.svg' },
  { name: 'mandatory-no-entry.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/India_road_sign_R3.svg' },
  { name: 'mandatory-one-way.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/India_road_sign_R4_1.svg' },
  { name: 'mandatory-no-parking.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/India_road_sign_R29.svg' },
  { name: 'cautionary-pedestrian-crossing.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/India_road_sign_W17.svg' },
  { name: 'cautionary-school-ahead.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/India_road_sign_W18.svg' }
];

console.log('Downloading Indian Road Signs SVGs from Wikimedia Commons...');

signs.forEach(sign => {
  const filePath = path.join(targetDir, sign.name);
  const file = fs.createWriteStream(filePath);
  https.get(sign.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${sign.name}`);
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {});
    console.error(`Error downloading ${sign.name}: ${err.message}`);
  });
});
