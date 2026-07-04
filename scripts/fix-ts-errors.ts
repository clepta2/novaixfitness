const fs = require('fs');
const path = require('path');

// Get component name from file path
function getComponentName(filePath) {
  const basename = path.basename(filePath, '.tsx');
  return basename.replace(/[^a-zA-Z0-9]/g, '');
}

// List of all broken .tsx files from tsc output
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
  'src/components/ui/AnimatedEntry.tsx',
  'src/components/ui/AnimatedHeader.tsx',
  'src/components/ui/BillingToggle.tsx',
  'src/components/ui/CardHeader.tsx',
  'src/components/ui/CategoryFilter.tsx',
  'src/components/ui/CategoryGrid.tsx',
  'src/components/ui/Chip.tsx',
  'src/components/ui/CountdownTimer.tsx',
  'src/components/ui/ErrorDisplay.tsx',
  'src/components/ui/FeatureCheckRow.tsx',
  'src/components/ui/FloatingCard.tsx',
  'src/components/ui/FormField.tsx',
  'src/components/ui/FormValidation.tsx',
  'src/components/ui/HapticButton.tsx',
  'src/components/ui/InfoRow.tsx',
  'src/components/ui/KeyValueRow.tsx',
  'src/components/ui/LinkCard.tsx',
  'src/components/ui/ListItem.tsx',
  'src/components/ui/LoadingIndicator.tsx',
  'src/components/ui/LoadingScreen.tsx',
  'src/components/ui/MagneticButton.tsx',
  'src/components/ui/MetaRow.tsx',
  'src/components/ui/MorphingIcon.tsx',
  'src/components/ui/MuscleBar.tsx',
  'src/components/ui/PageHeader.tsx',
  'src/components/ui/PaymentHistoryItem.tsx',
  'src/components/ui/PrimaryActionButton.tsx',
  'src/components/ui/PrimaryButton.tsx',
  'src/components/ui/ProfileStatsRow.tsx',
  'src/components/ui/ProgressSteps.tsx',
  'src/components/ui/RefreshableContainer.tsx',
  'src/components/ui/Row.tsx',
  'src/components/ui/ScoreBar.tsx',
  'src/components/ui/ScreenError.tsx',
  'src/components/ui/ScreenHeader.tsx',
  'src/components/ui/SectionHeader.tsx',
  'src/components/ui/SectionLabel.tsx',
  'src/components/ui/SettingsItem.tsx',
  'src/components/ui/SocialAuthButtons.tsx',
  'src/components/ui/SpaceBetween.tsx',
  'src/components/ui/Spacer.tsx',
  'src/components/ui/StatItem.tsx',
  'src/components/ui/StatsRow.tsx',
  'src/components/ui/StatusCard.tsx',
  'src/components/ui/StepPill.tsx',
  'src/components/ui/StepProgress.tsx',
  'src/components/ui/ThemedInput.tsx',
  'src/components/ui/TipBox.tsx',
  'src/components/ui/ToggleRow.tsx',
  'src/components/ui/TypewriterText.tsx',
  'src/components/ui/WarningCard.tsx',
  'src/components/ui/WorkoutListItem.tsx',
  'src/components/workout/BasicInfoStep.tsx',
  'src/components/workout/ShareWorkoutCard.tsx',
  'src/components/workout/WorkoutCompletionCard.tsx',
  'src/components/workout/WorkoutIdleView.tsx',
  'src/components/workout/WorkoutProgressCard.tsx',
];

function fixFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`SKIP (not found): ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;
  const componentName = getComponentName(filePath);
  const propsName = componentName + 'Props';

  // === FIX 1: Named imports with weird line breaks ===
  // Pattern: import \n{ X  } \n from 'y'
  // → import { X } from 'y'
  content = content.replace(
    /import\s*\n(\{\s*[^}]+\s*\})\s*\n\s*from\s+/g,
    (match, imports) => {
      // Clean up the import block
      const cleaned = imports.replace(/\s+/g, ' ').trim();
      return `import ${cleaned} from `;
    }
  );

  // === FIX 2: Named imports with extra spaces ===
  // import { COLORS  } → import { COLORS }
  content = content.replace(/(\{\s*[^}]+?)(\s{2,})/g, '$1 ');

  // === FIX 3: Single-line imports with trailing whitespace ===
  // import { COLORS  } from 'x' → import { COLORS } from 'x'
  content = content.replace(/(\{\s*[^}]+?)(\s{2,})(}\s*from)/g, '$1 $3');

  // === FIX 4: Unnamed interface ===
  // interface \n{ ... } → interface Props { ... }
  // interface  { ... } → interface Props { ... }
  content = content.replace(
    /interface\s*\n\s*\{/g,
    `interface ${propsName} {`
  );
  content = content.replace(
    /interface\s+\{/g,
    `interface ${propsName} {`
  );

  // === FIX 5: Broken type alias ===
  // type Status\ntype = ... → type StatusType = ...
  content = content.replace(
    /type\s+(\w+)\s*\ntype\s*=/g,
    'type $1 ='
  );

  // === FIX 6: Missing function name ===
  // export \n\ndefault \n\nfunction ( → export default function ComponentName(
  content = content.replace(
    /export\s*\n\s*default\s*\n\s*\nfunction\s*\(/g,
    `export default function ${componentName}(`
  );
  // export default function ( → export default function ComponentName(
  content = content.replace(
    /export\s+default\s+function\s*\(/g,
    `export default function ${componentName}(`
  );
  // export \nfunction ( → export function ComponentName(
  content = content.replace(
    /export\s*\nfunction\s*\(/g,
    `export function ${componentName}(`
  );
  // export function ( without name
  content = content.replace(
    /export\s+function\s*\(/g,
    `export function ${componentName}(`
  );

  // === FIX 7: Missing variable name in const ===
  // const  = useColors() → const colors = useColors()
  content = content.replace(
    /const\s+=\s*useColors\(\)/g,
    'const colors = useColors()'
  );
  // const \n\n  = useColors() → const colors = useColors()
  content = content.replace(
    /const\s*\n\s*\n\s*=\s*useColors\(\)/g,
    'const colors = useColors()'
  );
  // const  = StyleSheet.create( → const styles = StyleSheet.create(
  content = content.replace(
    /const\s+=\s*StyleSheet\.create\(/g,
    'const styles = StyleSheet.create('
  );

  // === FIX 8: JSX expression line breaks ===
  // {styles.container\n\n} → {styles.container}
  // Remove stray newlines inside JSX expressions like {X\n\n}
  content = content.replace(
    /(\{[\w.]+(?:\([^)]*\))?(?:\?\.[^}]+)?)\n\s*\n(\})/g,
    '$1$2'
  );

  // === FIX 9: Multi-line style props with broken closing ===
  // style=\n{X\n\n}> → style={X}>
  content = content.replace(
    /(style=\s*)\n(\{[^}]+)\n\s*\n(\}>)/g,
    '$1$2$3'
  );

  // === FIX 10: Broken prop value line breaks ===
  // size=\n{48\n\n} → size={48}
  content = content.replace(
    /=\s*\n(\{[^}]+)\n\s*\n(\})/g,
    '={$1$2'
  );

  // === FIX 11: Function params with line break before closing ===
  // }]: ComponentProps)\n\n{ → }: ComponentProps) {
  content = content.replace(
    /(\}:\s*\w+)\)\s*\n\s*\n\{/g,
    '$1) {'
  );
  // }: Props) \n\n{ → }: Props) {
  content = content.replace(
    /(\}:\s*\w+Props)\)\s*\n\s*\n\{/g,
    '$1) {'
  );

  // === FIX 12: Blank line after function open ===
  // function Foo() {\n\n  → function Foo() {
  content = content.replace(
    /(function\s+\w+\([^)]*\)\s*\{)\s*\n\s*\n/g,
    '$1\n'
  );

  // === FIX 13: import React with comment on same line ===
  // import React  // comment\nfrom 'react' → import React from 'react'
  // Actually: // src/...\nimport React  \nfrom 'react' 
  // → // src/...  \nimport React from 'react'
  content = content.replace(
    /(\/\/[^\n]*)\s*\nimport\s+React\s*\n\s*from\s+'react'/g,
    '$1  \nimport React from \'react\''
  );

  // === FIX 14: Fix standalone import React\nfrom 'react' ===
  content = content.replace(
    /import\s+React\s*\n\s*from\s+'react'/g,
    "import React from 'react'"
  );

  // === FIX 15: Fix import with space before closing ===
  // { SPACING  } → { SPACING }
  content = content.replace(
    /(\w+)\s{2,}\}/g,
    '$1 }'
  );

  // === FIX 16: Fix JSX expression with nested content ===
  // {X\n} → {X}  (for standalone text/expression in JSX)
  // This handles patterns like: >{text\n\n}</Text>
  content = content.replace(
    /(>\s*\{[\w.]+)\n\s*\n(\})/g,
    '$1$2'
  );

  // === FIX 17: Fix "export \n\ndefault" pattern ===
  content = content.replace(
    /export\s*\n\s*\n\s*default\s*\n\s*\n/g,
    'export default '
  );
  // Also: export \ndefault → export default
  content = content.replace(
    /export\s*\n\s*default\s*\n/g,
    'export default '
  );

  // === FIX 18: Fix interface with comment inside ===
  // interface \n{ → interface Props {
  // (already handled above)

  // === FIX 19: Fix export default \nfunction (name) ===
  content = content.replace(
    /export\s+default\s*\n\s*function\s+(\w+)/g,
    'export default function $1'
  );

  // === FIX 20: Fix broken JSX return formatting ===
  // return (    <View style=\n{X\n\n}> → return (<View style={X}>
  content = content.replace(
    /(return\s*\(\s*<\w+\s+\w+=)\s*\n(\{[^}]+)\n\s*\n(\}>)/g,
    '$1$2$3'
  );

  // === FIX 21: Fix \n}  at end of JSX ===
  // }    </View>  );\n\n} → }    </View>  ); }
  content = content.replace(
    /(<\/\w+>\s*\)\s*;)\s*\n\s*\n(\})/g,
    '$1\n$2'
  );

  // === FIX 22: Fix broken object destructuring in JSX ===
  // {[styles.X, styles.Y]\n\n} → {[styles.X, styles.Y]}
  content = content.replace(
    /(\[[^\]]+)\]\s*\n\s*\n(\})/g,
    '$1]$2'
  );

  // === FIX 23: Fix "export \n\nfunction" ===
  content = content.replace(
    /export\s*\n\s*\nfunction\s+(\w+)/g,
    'export function $1'
  );

  // === FIX 24: Fix remaining unnamed interface patterns ===
  // After all other fixes, catch: interface {\n
  // (skip - already handled)

  // === FIX 25: Fix import break inside braces ===
  // import \n{ X \n} \n from → import { X } from
  content = content.replace(
    /import\s*\n(\{\s*\w+\s*\n\})\s*\n\s*from/g,
    (match, imp) => `import ${imp.replace(/\n/g, ' ')} from`
  );

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`FIXED: ${filePath}`);
  } else {
    console.log(`NO CHANGE: ${filePath}`);
  }
}

// Process all files
console.log(`\nProcessing ${brokenFiles.length} files...\n`);
brokenFiles.forEach(fixFile);
console.log('\nDone!');
