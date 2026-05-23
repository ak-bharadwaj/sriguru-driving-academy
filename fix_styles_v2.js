const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'components')
];

const REPLACEMENTS = [
  // Backgrounds
  { regex: /bg-slate-50\s+dark:bg-slate-[0-9]{3}(?:\/[0-9]+)?/g, replacement: 'bg-[rgb(var(--color-void))]' },
  { regex: /bg-white\s+dark:bg-slate-[0-9]{3}(?:\/[0-9]+)?/g, replacement: 'bg-[rgb(var(--color-surface))]' },
  { regex: /bg-slate-100\s+dark:bg-slate-[0-9]{3}(?:\/[0-9]+)?/g, replacement: 'bg-[rgb(var(--color-border))]' },
  { regex: /bg-slate-200\s+dark:bg-slate-[0-9]{3}(?:\/[0-9]+)?/g, replacement: 'bg-[rgb(var(--color-border))]' },
  { regex: /hover:bg-slate-50\s+dark:hover:bg-slate-[0-9]{3}(?:\/[0-9]+)?/g, replacement: 'hover:bg-[rgb(var(--color-surface))]' },
  { regex: /hover:bg-slate-100\s+dark:hover:bg-slate-[0-9]{3}(?:\/[0-9]+)?/g, replacement: 'hover:bg-[rgb(var(--color-border))]' },
  { regex: /hover:bg-slate-200\s+dark:hover:bg-slate-[0-9]{3}(?:\/[0-9]+)?/g, replacement: 'hover:bg-[rgb(var(--color-border))]' },
  
  // Mixed definitions
  { regex: /bg-slate-50\s+dark:bg-surface\/[0-9]+/g, replacement: 'bg-[rgb(var(--color-surface))]' },
  { regex: /bg-slate-100\s+dark:bg-surface\/[0-9]+/g, replacement: 'bg-[rgb(var(--color-border))]' },
  { regex: /bg-slate-200\/50\s+dark:bg-slate-900\/50/g, replacement: 'bg-[rgb(var(--color-surface))]/50' },
  
  // Hardcoded singles
  { regex: /className="min-h-screen bg-slate-50 font-body text-slate-900/g, replacement: 'className="min-h-screen bg-[rgb(var(--color-void))] font-body text-[rgb(var(--color-text-1))]' },
  
  // Borders
  { regex: /border-slate-[0-9]{3}(?:\/[0-9]+)?\s+dark:border-slate-[0-9]{3}(?:\/[0-9]+)?/g, replacement: 'border-[rgb(var(--color-border))]' },
  { regex: /border-slate-300\s+dark:border-white\/5/g, replacement: 'border-[rgb(var(--color-border))]' },
  
  // Text
  { regex: /text-slate-[0-9]{3}\s+dark:text-slate-[0-9]{3}/g, replacement: 'text-[rgb(var(--color-text-2))]' },
  { regex: /text-slate-[0-9]{3}\s+dark:text-white/g, replacement: 'text-[rgb(var(--color-text-1))]' },
  { regex: /text-slate-900\s+dark:text-white/g, replacement: 'text-[rgb(var(--color-text-1))]' },
  { regex: /text-slate-900/g, replacement: 'text-[rgb(var(--color-text-1))]' },
  { regex: /hover:text-slate-900\s+dark:hover:text-white/g, replacement: 'hover:text-[rgb(var(--color-text-1))]' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let original = content;

      for (const { regex, replacement } of REPLACEMENTS) {
        content = content.replace(regex, replacement);
      }

      if (content !== original) {
        console.log(`Updated: ${fullPath}`);
        fs.writeFileSync(fullPath, content, 'utf-8');
      }
    }
  }
}

for (const dir of DIRECTORIES) {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }
}

console.log("Done refactoring classes round 2.");
