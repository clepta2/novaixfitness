import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, extname } from 'path';

const DIR = join(process.cwd(), 'src', 'components');
const SKIP_DIRS = ['exports'];

function findTsxFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.includes(entry)) results.push(...findTsxFiles(full));
    } else if (extname(entry) === '.tsx') results.push(full);
  }
  return results;
}

function fixDuplicateReact(content) {
  const lines = content.split('\n');
  let hasStandaloneReact = false;
  let hasNamedReact = false;
  let standaloneIdx = -1;
  let namedIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (/^import React from ['"]react['"]\s*;?\s*$/.test(lines[i].trim())) {
      hasStandaloneReact = true;
      standaloneIdx = i;
    }
    if (/import\s+React\s*,\s*\{/.test(lines[i])) {
      hasNamedReact = true;
      namedIdx = i;
    }
  }

  if (hasStandaloneReact && hasNamedReact) {
    lines.splice(standaloneIdx, 1);
    return lines.join('\n');
  }
  return content;
}

let fixed = 0;
for (const f of findTsxFiles(DIR)) {
  const c = readFileSync(f, 'utf-8');
  const fixed_content = fixDuplicateReact(c);
  if (fixed_content !== c) {
    writeFileSync(f, fixed_content, 'utf-8');
    fixed++;
  }
}
console.log(`Fixed duplicate React imports in ${fixed} files.`);
