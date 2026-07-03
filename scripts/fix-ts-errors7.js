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

  // FIX PATTERN: const colors = useColors() inside function destructuring
  // The actual pattern is: ({\n \nconst colors = useColors(); param, ...
  // Or: ({\nconst colors = useColors(); param, ...
  // Or: {\n\nconst colors = useColors(); param, ...
  // Basically: opening brace + whitespace/newlines + const colors = useColors() + ... params ...

  // Step 1: Remove const colors = useColors() from destructuring context
  // Match: { + any whitespace (including newlines) + const colors = useColors() + whitespace
  const destructureFix = /\{\s*const\s+colors\s*=\s*useColors\(\);?\s*/g;
  if (destructureFix.test(content)) {
    content = content.replace(/\{\s*const\s+colors\s*=\s*useColors\(\);?\s*/g, '{');
  }

  // Also handle: {\n \nconst colors = useColors(); → {
  // The \s* in the above should match newlines and spaces... let me verify
  // Actually \s* DOES match \n, so the pattern above should work.
  // Let me also try: the const colors might have a semicolon or not

  // Step 2: Insert const colors = useColors() after function body opening
  if (!content.includes('const colors = useColors()')) {
    // Find function body opening
    const fnBodyMatch = content.match(/\}:\s*\w+\)\s*\{/);
    if (fnBodyMatch) {
      const insertIdx = content.indexOf(fnBodyMatch[0]) + fnBodyMatch[0].length;
      content = content.slice(0, insertIdx) + '\nconst colors = useColors();' + content.slice(insertIdx);
    }
  }

  // FIX: const colors = useColors() inside module-level object literal (= { ... })
  // Pattern: = {\n  \nconst colors = useColors(); key:
  const objLitFix = /=\s*\{\s*const\s+colors\s*=\s*useColors\(\);?\s*/g;
  if (objLitFix.test(content)) {
    content = content.replace(/=\s*\{\s*const\s+colors\s*=\s*useColors\(\);?\s*/g, ' = {\n');
    // Add before the object
    if (!content.includes('const colors = useColors()')) {
      const objIdx = content.indexOf(' = {');
      if (objIdx >= 0) {
        const lineStart = content.lastIndexOf('\n', objIdx) + 1;
        content = content.slice(0, lineStart) + 'const colors = useColors();\n' + content.slice(lineStart);
      }
    }
  }

  // FIX: type Status\n (missing Type)
  content = content.replace(/^type\s+Status\s*$/m, 'type StatusType');
  content = content.replace(/type\s+Status\s*\n/g, 'type StatusType\n');

  // FIX: Duplicate const colors = useColors() - keep only one
  const allMatches = [...content.matchAll(/const\s+colors\s*=\s*useColors\(\);?/g)];
  if (allMatches.length > 1) {
    const fnMatch = content.match(/(?:export\s+(?:default\s+)?)?function\s+\w+/);
    const fnStart = fnMatch ? content.indexOf(fnMatch[0]) : 0;

    let bestIdx = -1;
    let bestDist = Infinity;
    for (const m of allMatches) {
      if (m.index >= fnStart) {
        const dist = m.index - fnStart;
        if (dist < bestDist) { bestDist = dist; bestIdx = m.index; }
      }
    }

    if (bestIdx >= 0) {
      const toRemove = allMatches.filter(m => m.index !== bestIdx).sort((a, b) => b.index - a.index);
      for (const m of toRemove) {
        let endIdx = m.index + m[0].length;
        while (endIdx < content.length && content[endIdx] === ' ') endIdx++;
        if (endIdx < content.length && content[endIdx] === '\n') {
          endIdx++;
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

console.log(`Processing ${brokenFiles.length} files...\n`);
brokenFiles.forEach(fixFile);
console.log('\nDone!');
