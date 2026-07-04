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

  // FIX 1: Move `const colors = useColors();` OUT of StyleSheet.create body
  // Pattern: StyleSheet.create(\n{\n\nconst colors = useColors();
  // Or: StyleSheet.create({\nconst colors = useColors();
  // Or: = {\n\nconst colors = useColors();  (inside object literals)
  const lines = content.split('\n');
  const extractedColorsLines = [];
  const filteredLines = [];

  let insideStyleSheetCreate = false;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect if we're entering StyleSheet.create
    if (trimmed.includes('StyleSheet.create(')) {
      insideStyleSheetCreate = true;
      braceDepth = 0;
    }

    // Track brace depth for StyleSheet.create block
    if (insideStyleSheetCreate) {
      for (const ch of trimmed) {
        if (ch === '{') braceDepth++;
        if (ch === '}') braceDepth--;
      }
    }

    // If line is `const colors = useColors();` and we're inside StyleSheet.create or an object literal
    if (trimmed === 'const colors = useColors();' || trimmed === 'const colors=useColors();') {
      // Check if previous non-empty line looks like we're inside StyleSheet.create or object literal
      const prevNonEmpty = filteredLines.filter(l => l.trim()).slice(-1)[0] || '';
      if (insideStyleSheetCreate || prevNonEmpty.includes('= {') || prevNonEmpty.includes('StyleSheet.create') || prevNonEmpty.match(/^\s*\{$/) || prevNonEmpty.endsWith('{')) {
        extractedColorsLines.push(line);
        continue; // skip this line from its current position
      }
    }

    filteredLines.push(line);
  }

  if (extractedColorsLines.length > 0) {
    // Find where to insert: before the styles const or before the StyleSheet.create
    let insertIdx = -1;
    for (let i = 0; i < filteredLines.length; i++) {
      if (filteredLines[i].trim().includes('StyleSheet.create(')) {
        insertIdx = i;
        break;
      }
    }
    if (insertIdx === -1) {
      // Find the const styles = line
      for (let i = 0; i < filteredLines.length; i++) {
        if (filteredLines[i].trim().startsWith('const styles')) {
          insertIdx = i;
          break;
        }
      }
    }

    if (insertIdx >= 0) {
      const colorDecl = extractedColorsLines[0].trim();
      filteredLines.splice(insertIdx, 0, colorDecl);
    }

    content = filteredLines.join('\n');
  }

  // FIX 2: `const colors = useColors()` inside non-StyleSheet object literals
  // Pattern: const RANK_COLORS = {\n\nconst colors = useColors();
  // This was already handled by the above logic

  // FIX 3: Fix interface extends missing name
  // `interface  extends TextInputProps` → `interface ThemedInputProps extends TextInputProps`
  const componentName = path.basename(filePath, '.tsx');
  content = content.replace(
    /interface\s+extends\s+(\w+)/g,
    `interface ${componentName}Props extends $1`
  );

  // FIX 4: Fix broken type/interface names across lines
  // `interface LeaderboardEn\ntry {` → `interface LeaderboardEntry {`
  content = content.replace(
    /interface\s+(\w+)\n(\w+)\s*\{/g,
    (match, part1, part2) => {
      return `interface ${part1}${part2} {`;
    }
  );
  // Same for type: `type Status\nType` → `type StatusType`
  content = content.replace(
    /type\s+(\w+)\n(\w+)\s*[=;]/g,
    (match, part1, part2) => {
      return `type ${part1}${part2} =`;
    }
  );

  // FIX 5: Line 2 comment merged with content
  // "// file.tsx// desc\n" is fine, but "// ...\nimport" issues
  // Handle: `// section // desc\n` where desc runs into next line
  content = content.replace(
    /(\/\/\s*[^\n]+?)\n(import\s)/g,
    '$1\n$2'
  );

  // FIX 6: Fix `interface  extends` with double space
  content = content.replace(/interface\s{2,}/g, 'interface ');

  // FIX 7: Fix broken JSX `{` on wrong line patterns for LiveLeaderboard
  // `{ false: colors.border, \n true: ...}` - this is fine actually
  // `{ opacity: fadeAnim }` on separate lines - also fine

  // FIX 8: Fix `SocialAuthButtons` - `useColors` referenced but not called in component
  // This is already handled if const colors = useColors() exists

  // FIX 9: Fix `ScreenError` line 2 issue
  // "// src/...\n// ..." merged into one line

  // FIX 10: Ensure `const styles` is not followed by missing variable
  content = content.replace(/const\s+styles\s*=\s*StyleSheet\.create\(\s*\n\s*\n\s*\n/g, 'const styles = StyleSheet.create({\n');

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
