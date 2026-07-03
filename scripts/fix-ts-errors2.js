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

  // FIX: Line 1 comment merged with import
  // "// src/...// commentimport React" → "// src/...// comment\nimport React"
  content = content.replace(
    /(\/\/[^\n]*?)(import\s+)/g,
    '$1\n$2'
  );

  // FIX: Line 1 comment merged with next comment
  // "// file.tsx// comment\n" stays as is, but:
  // "// ...// ...\nimport" → separate them
  content = content.replace(
    /(\/\/[^\n]*\/\/[^\n]*?)(import\s)/g,
    '$1\n$2'
  );

  // FIX: Remove stray `const colors = useColors();` from inside object literals
  // Pattern: `= {\n\nconst colors = useColors();` → move colors outside
  // We need to extract it and place before the const
  if (content.includes('const colors = useColors();')) {
    // Remove it from wherever it is (inside object literals / StyleSheet.create)
    content = content.replace(/\n\s*const colors = useColors\(\);\s*\n/g, '\n');

    // Check if colors is used but not declared in component scope
    // If there's a useColors import but no const colors = useColors() in the component,
    // we need to add it. Find where the component function starts.
    if (content.includes('useColors') && !content.match(/const\s+colors\s*=\s*useColors\(\)/)) {
      // Find the component function opening
      const fnMatch = content.match(/(export\s+(?:default\s+)?function\s+\w+\s*\([^)]*\)\s*\{)/);
      if (fnMatch) {
        const idx = content.indexOf(fnMatch[0]) + fnMatch[0].length;
        content = content.slice(0, idx) + '\nconst colors = useColors();\n' + content.slice(idx);
      }
    }
  }

  // FIX: `const = SPACER_SIZES[size]` → `const value = SPACER_SIZES[size]`
  content = content.replace(
    /const\s*=\s*(SPACER_SIZES\[)/g,
    'const value = $1'
  );

  // FIX: Generic `const = expression` where variable name is missing
  content = content.replace(
    /const\s*=\s*(?!useColors|StyleSheet)/g,
    'const value = '
  );

  // FIX: `type Status\n` → `type StatusType\n` (when followed by just a newline then `type =`)
  content = content.replace(
    /type\s+(Status)\s*\n\s*type\s*=/g,
    'type StatusType ='
  );

  // FIX: Double opening brace in object literal: = {{ → = {
  content = content.replace(/(=\s*)\{\{/g, '$1{');

  // FIX: `export \nfunction Name` (with export on separate line)
  content = content.replace(/export\s*\nfunction\s+(\w+)/g, 'export function $1');

  // FIX: Function declaration broken: `export \nfunction Name` → `export function Name`
  content = content.replace(/export\s+function\s+\n(\w+)/g, 'export function $1');

  // FIX: `const styles = StyleSheet.create(\n{\n\nconst colors` issue
  // The pattern: StyleSheet.create({\n\nconst colors = ...}; → colors should be before styles
  // This was already handled above by removing const colors from inside

  // FIX: `const = StyleSheet.create(` → `const styles = StyleSheet.create(`
  content = content.replace(/const\s*=\s*StyleSheet\.create/g, 'const styles = StyleSheet.create');

  // FIX: `interface Name {` with missing type keyword linebreak issues
  // Already fixed in pass 1

  // FIX: Broken switch statement in HapticButton-like files
  // "// Haptic feedback switch (haptic) {" → "switch (haptic) {"
  content = content.replace(
    /\/\/\s*Haptic feedback switch\s*\(/,
    'switch ('
  );

  // FIX: Broken interface with missing name
  content = content.replace(/interface\s*\n\s*\{/g, `interface Props {`);

  // FIX: `export \n\ndefault \nfunction` → `export default function`
  content = content.replace(/export\s*\n\s*\n\s*default\s*\n\s*\nfunction/g, 'export default function');

  // FIX: interface extends error: `interface X extends` where extends is misused
  // "Interface name cannot be 'extends'" - this means `interface extends Foo` is wrong
  content = content.replace(/interface\s+(\w+)\s+extends\s+(\w+)/g, 'interface $1 extends $2'); // leave alone, this is valid TS

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
