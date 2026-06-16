const https = require('https');

function search(query, callback) {
  https.get('https://freesound.org/search/?q=' + encodeURIComponent(query) + '&f=duration:[0+TO+5]', res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const match = data.match(/data-mp3="([^"]+)"/);
      if (match) callback(match[1]);
      else callback(null);
    });
  });
}

search('arcade engine loop', (url) => console.log('Engine:', url));
search('arcade crash', (url) => console.log('Crash:', url));
search('arcade win', (url) => console.log('Win:', url));
