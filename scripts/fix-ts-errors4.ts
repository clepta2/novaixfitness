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
  'src/components/social/FeedEmptyState.tsx',
  'src/components/social/LiveLeaderboard.tsx',
  'src/components/ui/AnimatedHeader.tsx',
  'src/components/ui/BillingToggle.tsx',
  'src/components/ui/CardHeader.tsx',
  'src/components/ui/CategoryFilter.tsx',
  'src/components/ui/Chip.tsx',
  'src/components/ui/CountdownTimer.tsx',
  'src/components/ui/ErrorDisplay.tsx',
  'src/components/ui/FloatingCard.tsx',
  'src/components/ui/FormField.tsx',
  'src/components/ui/HapticButton.tsx',
  'src/components/ui/KeyValueRow.tsx',
  'src/components/ui/ListItem.tsx',
  'src/components/ui/LoadingIndicator.tsx',
  'src/components/ui/LoadingScreen.tsx',
  'src/components/ui/MagneticButton.tsx',
  'src/components/ui/MorphingIcon.tsx',
  'src/components/ui/PageHeader.tsx',
  'src/components/ui/PaymentHistoryItem.tsx',
  'src/components/ui/PrimaryActionButton.tsx',
  'src/components/ui/PrimaryButton.tsx',
  'src/components/ui/ProgressSteps.tsx',
  'src/components/ui/ScoreBar.tsx',
  'src/components/ui/ScreenError.tsx',
  'src/components/ui/ScreenHeader.tsx',
  'src/components/ui/SectionHeader.tsx',
  'src/components/ui/SectionLabel.tsx',
  'src/components/ui/SettingsItem.tsx',
  'src/components/ui/SocialAuthButtons.tsx',
  'src/components/ui/Spacer.tsx',
  'src/components/ui/StatItem.tsx',
  'src/components/ui/StatusCard.tsx',
  'src/components/ui/StepProgress.tsx',
  'src/components/ui/ThemedInput.tsx',
  'src/components/ui/ToggleRow.tsx',
  'src/components/ui/TypewriterText.tsx',
  'src/components/workout/BasicInfoStep.tsx',
  'src/components/workout/ShareWorkoutCard.tsx',
  'src/components/workout/WorkoutCompletionCard.tsx',
  'src/components/workout/WorkoutIdleView.tsx',
  'src/components/workout/WorkoutProgressCard.tsx',
];

function fixFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;

  // FIX 1: Remove ALL `const colors = useColors();` lines that are NOT inside a function body
  // Strategy: find all occurrences, check if they're inside StyleSheet.create or object literal
  // We want to KEEP the one inside the component function and remove any inside StyleSheet.create/object

  // Find the component function
  const fnMatch = content.match(/(?:export\s+(?:default\s+)?)?function\s+\w+\s*\([^)]*\)\s*\{/);
  const fnEndMatch = fnMatch ? content.indexOf(fnMatch[0]) : -1;

  // Find all const colors = useColors(); occurrences
  const colorsPattern = /const\s+colors\s*=\s*useColors\(\);?/g;
  let match;
  const occurrences = [];
  while ((match = colorsPattern.exec(content)) !== null) {
    occurrences.push({ index: match.index, end: match.index + match[0].length, text: match[0] });
  }

  if (occurrences.length > 1) {
    // Keep the first one inside the component function, remove all others
    let keptOne = false;
    for (let i = occurrences.length - 1; i >= 0; i--) {
      const occ = occurrences[i];
      const isInsideFn = fnEndMatch >= 0 && occ.index > fnEndMatch;
      const isInsideStyleSheet = occ.index > content.indexOf('StyleSheet.create');

      if (isInsideStyleSheet || (!isInsideFn && keptOne)) {
        // Remove this occurrence
        let removeText = content.substring(occ.index, occ.end);
        // Also remove surrounding whitespace/newlines
        const before = content.substring(Math.max(0, occ.index - 2), occ.index);
        if (before.endsWith('\n\n')) {
          removeText = '\n' + removeText;
        }
        content = content.substring(0, occ.index) + content.substring(occ.end);
      } else if (isInsideFn && !keptOne) {
        keptOne = true;
      }
    }
  }

  // FIX 2: If colors is used in StyleSheet.create but const colors = useColors() is missing,
  // add it before StyleSheet.create
  if (content.includes('colors.') && content.includes('StyleSheet.create') && !content.includes('const colors = useColors()')) {
    const scIdx = content.indexOf('StyleSheet.create');
    // Find the line before
    const lineStart = content.lastIndexOf('\n', scIdx) + 1;
    content = content.substring(0, lineStart) + 'const colors = useColors();\n' + content.substring(lineStart);
  }

  // FIX 3: Fix `interface  extends TextInputProps` (missing interface name)
  content = content.replace(/interface\s+extends\s+(\w+)/g, (match, base) => {
    const name = path.basename(filePath, '.tsx') + 'Props';
    return `interface ${name} extends ${base}`;
  });

  // FIX 4: Fix broken interface/type names: `interface LeaderboardEn\ntry`
  content = content.replace(/interface\s+(\w+)\n(\w+)\s*\{/g, (match, p1, p2) => {
    return `interface ${p1}${p2} {`;
  });
  content = content.replace(/type\s+(\w+)\n(\w+)\s*[=;]/g, (match, p1, p2) => {
    return `type ${p1}${p2} =`;
  });

  // FIX 5: Remove blank line after StyleSheet.create opening
  content = content.replace(
    /StyleSheet\.create\(\s*\n\s*\n/g,
    'StyleSheet.create({\n'
  );

  // FIX 6: Fix `const styles = StyleSheet.create(\n{` → ensure proper opening
  content = content.replace(
    /const\s+styles\s*=\s*StyleSheet\.create\(\s*\n\s*\{/g,
    'const styles = StyleSheet.create({'
  );

  // FIX 7: Fix line-merged comment at line 1
  content = content.replace(
    /(\/\/[^\n]*?)(import\s)/g,
    '$1\n$2'
  );

  // FIX 8: Fix `const  = ` (double space before equals, missing var name)
  content = content.replace(/const\s{2,}=\s/g, 'const _unused = ');

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
