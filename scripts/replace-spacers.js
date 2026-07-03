// scripts/replace-spacers.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const files40 = [
  'app/planner.tsx',
  'app/forum.tsx',
  'app/weekly-progress.tsx',
  'app/warmup.tsx',
  'app/recovery.tsx',
  'app/mindfulness.tsx',
  'app/marketplace-favorites.tsx',
  'app/analytics.tsx',
  'app/(tabs)/perfil/links.tsx',
  'app/(tabs)/perfil/conheca-nos.tsx',
];

const files100 = [
  'app/workout/create.tsx',
  'app/marketplace-detail.tsx',
  'app/(tabs)/perfil/lgpd.tsx',
  'app/(tabs)/library.tsx',
  'app/(tabs)/home.tsx',
  'app/(tabs)/feed.tsx',
];

let count = 0;

function processFile(relFile, height, constantName) {
  const filePath = path.join(ROOT, relFile);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace <View style={{ height: N }} /> with spacer component
  content = content.replace(
    new RegExp(`<View style=\\{\\{ height: ${height} \\}\\} />`, 'g'),
    `<View style={{ height: ${constantName} }} />`
  );

  // Add SCREEN_BOTTOM_SPACER or TAB_BAR_SPACER import if not present
  if (content !== original && !content.includes(constantName)) {
    // Find existing spacing import
    if (content.includes("from '../src/constants/spacing'") || content.includes('from "../../src/constants/spacing"')) {
      const isDeep = relFile.includes('(tabs)');
      const prefix = isDeep ? '../../src' : '../src';
      const importPath = `${prefix}/constants/spacing`;
      
      // Check if SCREEN_BOTTOM_SPACER or TAB_BAR_SPACER already imported
      if (!content.includes(constantName)) {
        // Add to existing spacing import
        content = content.replace(
          new RegExp(`import \\{ ([^}]+)\\} from '${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`),
          (match, imports) => {
            if (imports.includes(constantName)) return match;
            return `import { ${imports.trim()}, ${constantName} } from '${importPath}'`;
          }
        );
      }
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
    console.log(`Fixed: ${relFile}`);
  }
}

for (const f of files40) processFile(f, 40, 'SCREEN_BOTTOM_SPACER');
for (const f of files100) processFile(f, 100, 'TAB_BAR_SPACER');

console.log(`\nTotal files fixed: ${count}`);
