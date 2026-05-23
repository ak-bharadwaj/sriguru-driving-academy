const fs = require('fs');
const file = 'c:\\Users\\dorni\\OneDrive\\Desktop\\driving scl\\app\\(student)\\student\\learn\\page.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');
// Find index of "{/* Self study warning card */}"
const startIdx = lines.findIndex(l => l.includes('{/* Self study warning card */}'));
const endIdx = lines.findIndex(l => l.includes('{/* --- GOOGLE-LEVEL SKILL DIRECTORY GRID --- */}'));

if (startIdx !== -1 && endIdx !== -1) {
  lines.splice(startIdx, endIdx - startIdx);
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Successfully removed mock course builder lines from ' + startIdx + ' to ' + endIdx);
} else {
  console.log('Could not find markers: ', startIdx, endIdx);
}
