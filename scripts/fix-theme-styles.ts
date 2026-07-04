const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'app');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find StyleSheet.create block
  const styleMatch = content.match(/const styles = StyleSheet\.create\((\{[\s\S]*?\})\);/);
  if (!styleMatch) return false;
  
  const styleBlock = styleMatch[1];
  if (!styleBlock.includes('colors.')) return false;
  
  // Check if already fixed (has makeStyles)
  if (content.includes('const makeStyles')) return false;
  
  // Replace const styles = StyleSheet.create({...}) with makeStyles function
  const newStyles = `const makeStyles = (colors: any) => StyleSheet.create(${styleBlock});`;
  content = content.replace(styleMatch[0], newStyles);
  
  // Add const styles = makeStyles(colors) after useTheme line
  const themeLine = content.match(/const \{ colors[^}]*\} = useTheme\(\);/);
  if (themeLine) {
    content = content.replace(themeLine[0], themeLine[0] + '\n  const styles = makeStyles(colors);');
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

// Main
const files = [];
function scanDir(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) scanDir(fullPath);
    else if (item.name.endsWith('.tsx')) files.push(fullPath);
  }
}

scanDir(APP_DIR);

let fixed = 0;
let skipped = 0;

for (const file of files) {
  try {
    if (fixFile(file)) {
      fixed++;
      console.log('Fixed: ' + path.relative(APP_DIR, file));
    } else {
      skipped++;
    }
  } catch (e) {
    console.error('Failed: ' + path.relative(APP_DIR, file) + ' - ' + e.message);
  }
}

console.log('\nSummary:');
console.log('  Fixed: ' + fixed);
console.log('  Skipped: ' + skipped);
