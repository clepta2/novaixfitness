const fs = require('fs');
const path = require('path');

const files = [
  'src/components/analytics/SleepCorrelation.tsx',
  'src/components/analytics/BenchmarkComparison.tsx',
  'src/components/analytics/ProgressPrediction.tsx',
  'src/components/social/LiveLeaderboard.tsx',
  'src/components/progress/ComparisonSlider.tsx',
];

function fixFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;

  // Convert: const styles = StyleSheet.create({...}) at module scope
  // To: const makeStyles = (colors: any) => StyleSheet.create({...})
  // Then in component: const styles = makeStyles(colors);

  if (content.includes('const styles = StyleSheet.create({')) {
    // Check if colors is used in styles
    const stylesStart = content.indexOf('const styles = StyleSheet.create({');
    if (stylesStart >= 0) {
      // Check if there's colors usage after stylesStart
      const stylesSection = content.substring(stylesStart);
      if (stylesSection.includes('colors.')) {
        // Convert to makeStyles function
        content = content.replace(
          /const styles = StyleSheet\.create\(\{/g,
          'const makeStyles = (colors: any) => StyleSheet.create({'
        );

        // Find the component function and add const styles = makeStyles(colors);
        const fnMatch = content.match(/(?:export\s+(?:default\s+)?)?function\s+\w+/);
        if (fnMatch) {
          const fnIdx = content.indexOf(fnMatch[0]);
          const bodyStart = content.indexOf('{', fnIdx);
          if (bodyStart >= 0) {
            // Find first statement after opening brace
            const afterBrace = bodyStart + 1;
            // Check if there's already a const colors = useColors() or similar
            const hasColorsDecl = content.substring(afterBrace, afterBrace + 200).includes('const colors');
            if (!hasColorsDecl) {
              // Add useColors and styles after function opening
              const insertPoint = afterBrace;
              content = content.slice(0, insertPoint) + '\nconst colors = useColors();\nconst styles = makeStyles(colors);\n' + content.slice(insertPoint);
            } else {
              // Just add styles = makeStyles(colors) after colors declaration
              const colorsDeclEnd = content.indexOf('const colors', afterBrace);
              const colorsLineEnd = content.indexOf('\n', colorsDeclEnd);
              if (colorsLineEnd >= 0) {
                content = content.slice(0, colorsLineEnd + 1) + 'const styles = makeStyles(colors);\n' + content.slice(colorsLineEnd + 1);
              }
            }
          }
        }
      }
    }
  }

  // Also handle module-level const S = {...} with colors references
  if (content.includes('const S = {') && content.includes('colors.')) {
    // Find where const S starts
    const sStart = content.indexOf('const S = {');
    const sEnd = content.indexOf('};', sStart) + 2;
    if (sStart >= 0 && sEnd > sStart) {
      const sBlock = content.substring(sStart, sEnd);
      if (sBlock.includes('colors.')) {
        // Move this inside the component as makeStyles
        content = content.substring(0, sStart) + content.substring(sEnd);
      }
    }
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`FIXED: ${filePath}`);
  } else {
    console.log(`NO CHANGE: ${filePath}`);
  }
}

console.log(`Processing ${files.length} files...\n`);
files.forEach(fixFile);
console.log('\nDone!');
