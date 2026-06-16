const https = require('https');

function search(query, callback) {
  https.get('https://freesound.org/search/?q=' + encodeURIComponent(query), res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const match = data.match(/data-mp3="([^"]+)"/);
      if (match) callback(match[1]);
      else callback(null);
    });
  });
}

search('metal crash', (url) => console.log('Crash:', url));
