const fs = require('fs');
const https = require('https');
const path = require('path');

const wikiData = JSON.parse(fs.readFileSync('./wiki-mapping.json', 'utf8'));
const signsDir = path.join(__dirname, 'public', 'signs');

if (!fs.existsSync(signsDir)) {
    fs.mkdirSync(signsDir, { recursive: true });
}

async function downloadFile(filename) {
    const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
    const dest = path.join(signsDir, filename);
    
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
        return; // Skip if already downloaded and valid
    }

    return new Promise((resolve, reject) => {
        // Special:FilePath responds with a 302 redirect. We need to follow it.
        https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                https.get(res.headers.location, (redirectRes) => {
                    const file = fs.createWriteStream(dest);
                    redirectRes.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        resolve();
                    });
                }).on('error', reject);
            } else {
                const file = fs.createWriteStream(dest);
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }
        }).on('error', reject);
    });
}

async function run() {
    const filenames = Object.keys(wikiData);
    console.log(`Downloading ${filenames.length} signs...`);
    
    // Batch downloads to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < filenames.length; i += batchSize) {
        const batch = filenames.slice(i, i + batchSize);
        await Promise.all(batch.map(f => downloadFile(f).catch(e => console.error(`Failed ${f}:`, e.message))));
        console.log(`Downloaded ${Math.min(i + batchSize, filenames.length)} / ${filenames.length}`);
    }
    console.log('All downloads complete!');
}

run();
