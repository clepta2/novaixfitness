const fs = require('fs');
const path = require('path');

const brokenFiles = [
  'src/components/analytics/BenchmarkComparison.tsx',
  'src/components/analytics/MonthlyReport.tsx',
  'src/components/analytics/ProgressPrediction.tsx',
  'src/components/analytics/SleepCorrelation.tsx',
  'src/components/progress/ComparisonSlider.tsx',
  'src/components/social/ChallengeFriend.tsx',
  'src/components/social/LiveLeaderboard.tsx',
  'src/components/ui/AnimatedHeader.tsx',
  'src/components/ui/Chip.tsx',
  'src/components/ui/ErrorDisplay.tsx',
  'src/components/ui/FloatingCard.tsx',
  'src/components/ui/HapticButton.tsx',
  'src/components/ui/ListItem.tsx',
  'src/components/ui/MagneticButton.tsx',
  'src/components/ui/MorphingIcon.tsx',
  'src/components/ui/PageHeader.tsx',
  'src/components/ui/PrimaryActionButton.tsx',
  'src/components/ui/SectionHeader.tsx',
  'src/components/ui/SectionLabel.tsx',
  'src/components/ui/StatusCard.tsx',
  'src/components/ui/ToggleRow.tsx',
  'src/components/ui/TypewriterText.tsx',
  'src/components/ui/SocialAuthButtons.tsx',
  'src/components/ui/Spacer.tsx',
  'src/components/workout/BasicInfoStep.tsx',
  'src/components/workout/WorkoutCompletionCard.tsx',
  'src/components/workout/WorkoutProgressCard.tsx',
];

function fixFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;

  // PATTERN 1: const colors = useColors() inside function destructuring params
  // Matches: function Foo({\n<blank lines>\nconst colors = useColors(); param1, param2, ...
  // Or: function Foo({\nconst colors = useColors(); param1, param2, ...
  // Or: {\n\nconst colors = useColors(); param1, param2,
  // Fix: Remove from destructuring, place after function body opening {

  // Pattern: ({\n[blank lines]const colors = useColors(); ... })
  // We need to:
  // 1. Remove `const colors = useColors();` from inside the destructuring
  // 2. Insert it after the function body opening `{`

  // Step 1: Extract const colors = useColors() from destructuring
  const destructurePattern = /(\{)\s*\n\s*const\s+colors\s*=\s*useColors\(\);?\s*\n/g;
  let match;
  let hasDestructureFix = false;

  if (destructurePattern.test(content)) {
    hasDestructureFix = true;
    // Remove it from destructuring
    content = content.replace(/(\{)\s*\n\s*const\s+colors\s*=\s*useColors\(\);?\s*\n/g, '$1\n');

    // Now insert const colors = useColors(); after the function body opening {
    // Find the function opening {
    // Pattern: }: PropsName) {\n
    content = content.replace(
      /(\}:\s*\w+Props\)\s*\{)\n/g,
      '$1\nconst colors = useColors();\n'
    );
    // Also handle: }: Props) {\n (without Props suffix)
    if (!content.includes('const colors = useColors();\n')) {
      content = content.replace(
        /(\}:\s*\w+)\)\s*\{\n/g,
        '$1) {\nconst colors = useColors();\n'
      );
    }
  }

  // PATTERN 2: const colors = useColors() inside module-level object literal
  // Pattern: = {\n\nconst colors = useColors(); key: value
  // This is in StatusCard and LiveLeaderboard
  const objLitPattern = /=\s*\{\s*\n\s*const\s+colors\s*=\s*useColors\(\);?\s*\n/g;
  if (objLitPattern.test(content)) {
    // Remove from object literal
    content = content.replace(/=\s*\{\s*\n\s*const\s+colors\s*=\s*useColors\(\);?\s*\n/g, ' = {\n');

    // Check if we already have const colors = useColors() somewhere
    if (!content.includes('const colors = useColors()')) {
      // Add before the object literal
      const objIdx = content.indexOf(' = {');
      if (objIdx >= 0) {
        const lineStart = content.lastIndexOf('\n', objIdx) + 1;
        content = content.slice(0, lineStart) + 'const colors = useColors();\n' + content.slice(lineStart);
      }
    }
  }

  // PATTERN 3: Inline const colors = useColors() on same line as destructuring
  // function Foo({\nconst colors = useColors(); param1, ...}: Props)
  // Already handled by PATTERN 1 above

  // PATTERN 4: type Status (missing Type suffix)
  content = content.replace(
    /^type\s+Status\s*$/m,
    'type StatusType'
  );
  content = content.replace(
    /type\s+Status\s*\n/,
    'type StatusType\n'
  );

  // PATTERN 5: Fix line 2 comment merged issues
  content = content.replace(
    /(\/\/[^\n]*?)(import\s)/g,
    '$1\n$2'
  );

  // PATTERN 6: Fix `interface  extends` (double space)
  content = content.replace(/interface\s{2,}/g, 'interface ');

  // PATTERN 7: Fix broken interface/type across lines
  content = content.replace(/interface\s+(\w+)\n(\w+)\s*\{/g, (m, p1, p2) => `interface ${p1}${p2} {`);
  content = content.replace(/type\s+(\w+)\n(\w+)\s*[=;]/g, (m, p1, p2) => `type ${p1}${p2} =`);

  // PATTERN 8: Fix duplicate const colors = useColors() (keep only one)
  const allColorsMatches = [...content.matchAll(/const\s+colors\s*=\s*useColors\(\);?/g)];
  if (allColorsMatches.length > 1) {
    // Find which one is inside the component function
    const fnMatch = content.match(/(?:export\s+(?:default\s+)?)?function\s+\w+/);
    const fnStart = fnMatch ? content.indexOf(fnMatch[0]) : 0;

    // Keep the one closest to (but after) the function definition
    let bestIdx = -1;
    let bestDist = Infinity;
    for (const m of allColorsMatches) {
      if (m.index >= fnStart) {
        const dist = m.index - fnStart;
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = m.index;
        }
      }
    }

    if (bestIdx >= 0) {
      // Remove all others (in reverse order to preserve indices)
      const toRemove = allColorsMatches
        .filter(m => m.index !== bestIdx)
        .sort((a, b) => b.index - a.index);

      for (const m of toRemove) {
        let endIdx = m.index + m[0].length;
        // Skip trailing spaces
        while (endIdx < content.length && content[endIdx] === ' ') endIdx++;
        // Skip trailing newline
        if (endIdx < content.length && content[endIdx] === '\n') {
          endIdx++;
          // Skip extra blank lines
          while (endIdx < content.length && content[endIdx] === '\n') endIdx++;
        }
        content = content.slice(0, m.index) + content.slice(endIdx);
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

console.log(`\nProcessing ${brokenFiles.length} files...\n`);
brokenFiles.forEach(fixFile);
console.log('\nDone!');
