const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('route.ts') || file.endsWith('route.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'app/api'));
let count = 0;
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('export async function GET') && !content.includes('export const dynamic')) {
    const newContent = "export const dynamic = 'force-dynamic';\n" + content;
    fs.writeFileSync(f, newContent, 'utf8');
    count++;
  }
});
console.log('Fixed ' + count + ' files.');
