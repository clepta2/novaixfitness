const fs = require('fs');
const path = require('path');

const brokenFiles = [
  'src/components/analytics/BenchmarkComparison.tsx',
  'src/components/analytics/MonthlyReport.tsx',
  'src/components/analytics/ProgressPrediction.tsx',
  'src/components/analytics/SleepCorrelation.tsx',
  'src/components/auth/LanguageOption.tsx',
  'src/components/auth/LoginLogo.tsx',
  'src/components/auth/SocialButtons.tsx',
  'src/components/common/DailyCheckInModal.tsx',
  'src/components/common/SyncStatusIndicator.tsx',
  'src/components/gamification/GamificationSummary.tsx',
  'src/components/onboarding/ProcessingSteps.tsx',
  'src/components/progress/ComparisonSlider.tsx',
  'src/components/social/ChallengeFriend.tsx',
  'src/components/social/LiveLeaderboard.tsx',
  'src/components/ui/AnimatedHeader.tsx',
  'src/components/ui/CardHeader.tsx',
  'src/components/ui/CategoryFilter.tsx',
  'src/components/ui/Chip.tsx',
  'src/components/ui/CountdownTimer.tsx',
  'src/components/ui/FloatingCard.tsx',
  'src/components/ui/HapticButton.tsx',
  'src/components/ui/ListItem.tsx',
  'src/components/ui/MagneticButton.tsx',
  'src/components/ui/MorphingIcon.tsx',
  'src/components/ui/PageHeader.tsx',
  'src/components/ui/PaymentHistoryItem.tsx',
  'src/components/ui/PrimaryActionButton.tsx',
  'src/components/ui/PrimaryButton.tsx',
  'src/components/ui/ProgressSteps.tsx',
  'src/components/ui/ScoreBar.tsx',
  'src/components/ui/ScreenHeader.tsx',
  'src/components/ui/SettingsItem.tsx',
  'src/components/ui/SocialAuthButtons.tsx',
  'src/components/ui/Spacer.tsx',
  'src/components/ui/StatusCard.tsx',
  'src/components/ui/ToggleRow.tsx',
  'src/components/ui/TypewriterText.tsx',
  'src/components/workout/BasicInfoStep.tsx',
  'src/components/workout/WorkoutCompletionCard.tsx',
  'src/components/workout/WorkoutIdleView.tsx',
  'src/components/workout/WorkoutProgressCard.tsx',
];

function fixFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;

  // Strategy: Find ALL `const colors = useColors()` occurrences
  // Determine which ones are inside StyleSheet.create or const object literals
  // Remove them from there and ensure ONE exists before StyleSheet.create

  const scIdx = content.indexOf('StyleSheet.create');
  const componentFn = content.match(/(?:export\s+(?:default\s+)?)?function\s+\w+\s*\([^)]*\)\s*\{/);

  // Find all occurrences of const colors = useColors()
  const regex = /const\s+colors\s*=\s*useColors\(\);?/g;
  let m;
  const occurrences = [];
  while ((m = regex.exec(content)) !== null) {
    occurrences.push({ idx: m.index, len: m[0].length, text: m[0] });
  }

  if (occurrences.length === 0) {
    // No colors declaration at all - check if colors is used
    if (content.includes('colors.') && scIdx >= 0) {
      // Add before StyleSheet.create
      const lineStart = content.lastIndexOf('\n', scIdx) + 1;
      content = content.slice(0, lineStart) + 'const colors = useColors();\n' + content.slice(lineStart);
    }
    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`FIXED (added colors): ${filePath}`);
    } else {
      console.log(`NO CHANGE: ${filePath}`);
    }
    return;
  }

  if (occurrences.length === 1) {
    const occ = occurrences[0];
    // Check if it's inside StyleSheet.create (after scIdx)
    if (scIdx >= 0 && occ.idx > scIdx) {
      // It's inside StyleSheet.create - need to move it before
      // Remove the occurrence and any trailing whitespace/newline
      let endIdx = occ.idx + occ.len;
      // Skip trailing whitespace on same line
      while (endIdx < content.length && content[endIdx] === ' ') endIdx++;
      // If followed by a property name on same line (e.g., `; option: {`), keep the rest
      const afterText = content.substring(endIdx);
      if (afterText.startsWith('\n') || afterText.startsWith('\r')) {
        endIdx++; // skip the newline
        // Also skip extra blank lines
        while (endIdx < content.length && (content[endIdx] === '\n' || content[endIdx] === '\r')) endIdx++;
      }
      // Remove the occurrence
      content = content.slice(0, occ.idx) + content.slice(endIdx);

      // Now add it before StyleSheet.create (recalculate index since we removed text)
      const newScIdx = content.indexOf('StyleSheet.create');
      const lineStart = content.lastIndexOf('\n', newScIdx) + 1;
      content = content.slice(0, lineStart) + 'const colors = useColors();\n' + content.slice(lineStart);
    }
    // else: it's already in the right place (inside component or before styles)
  } else {
    // Multiple occurrences - keep the one inside the component function, remove all others
    let keptInside = false;
    for (let i = occurrences.length - 1; i >= 0; i--) {
      const occ = occurrences[i];
      const insideComponent = componentFn && occ.idx > content.indexOf(componentFn[0]);
      const insideStyles = scIdx >= 0 && occ.idx > scIdx;

      if (insideStyles || (!insideComponent && keptInside)) {
        let endIdx = occ.idx + occ.len;
        while (endIdx < content.length && content[endIdx] === ' ') endIdx++;
        const afterText = content.substring(endIdx);
        if (afterText.startsWith('\n') || afterText.startsWith('\r')) {
          endIdx++;
          while (endIdx < content.length && (content[endIdx] === '\n' || content[endIdx] === '\r')) endIdx++;
        }
        content = content.slice(0, occ.idx) + content.slice(endIdx);
      } else if (insideComponent && !keptInside) {
        keptInside = true;
      } else if (!insideComponent && !insideStyles) {
        // It's outside both - could be module level, keep it as fallback
        if (!keptInside) keptInside = true;
      }
    }
  }

  // FIX: interface extends missing name
  content = content.replace(/interface\s+extends\s+(\w+)/g, (match, base) => {
    return `interface ${path.basename(filePath, '.tsx')}Props extends ${base}`;
  });

  // FIX: broken type/interface names across lines
  content = content.replace(/interface\s+(\w+)\n(\w+)\s*\{/g, (m, p1, p2) => `interface ${p1}${p2} {`);
  content = content.replace(/type\s+(\w+)\n(\w+)\s*[=;]/g, (m, p1, p2) => `type ${p1}${p2} =`);

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
