const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'components')
];

const REPLACEMENTS = [
  { regex: /bg-slate-50\s+dark:bg-slate-950/g, replacement: 'bg-[rgb(var(--color-void))]' },
  { regex: /bg-white\s+dark:bg-slate-900/g, replacement: 'bg-[rgb(var(--color-surface))]' },
  { regex: /border-slate-200\s+dark:border-slate-800/g, replacement: 'border-[rgb(var(--color-border))]' },
  { regex: /border-slate-200\s+dark:border-slate-700/g, replacement: 'border-[rgb(var(--color-border))]' },
  { regex: /text-slate-900\s+dark:text-slate-100/g, replacement: 'text-[rgb(var(--color-text-1))]' },
  { regex: /text-slate-900\s+dark:text-white/g, replacement: 'text-[rgb(var(--color-text-1))]' },
  { regex: /text-slate-600\s+dark:text-slate-400/g, replacement: 'text-[rgb(var(--color-text-2))]' },
  { regex: /text-slate-600\s+dark:text-slate-300/g, replacement: 'text-[rgb(var(--color-text-2))]' },
  { regex: /text-slate-500\s+dark:text-slate-400/g, replacement: 'text-[rgb(var(--color-text-3))]' },
  { regex: /text-slate-500/g, replacement: 'text-[rgb(var(--color-text-3))]' }, // Some generic fallbacks
  { regex: /bg-slate-100\s+dark:bg-slate-800/g, replacement: 'bg-[rgb(var(--color-border))]' },
  { regex: /bg-slate-200\s+dark:bg-slate-700/g, replacement: 'hover:bg-[rgb(var(--color-border))]' },
  // Fix the transparent clip text that breaks on light mode
  { regex: /text-transparent\s+bg-clip-text\s+bg-gradient-to-r\s+from-primary\s+to-accent/g, replacement: 'text-[rgb(var(--color-primary))]' },
  { regex: /bg-gradient-to-r\s+from-primary\s+to-accent\s+bg-clip-text\s+text-transparent/g, replacement: 'text-[rgb(var(--color-primary))]' },
  { regex: /text-transparent\s+bg-clip-text\s+bg-gradient-to-r\s+from-blue-600\s+to-cyan-500/g, replacement: 'text-[rgb(var(--color-primary))]' }
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

console.log("Done refactoring classes.");
