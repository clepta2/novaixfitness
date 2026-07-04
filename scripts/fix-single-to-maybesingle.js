// scripts/fix-single-to-maybesingle.js
// Replace .single() with .maybeSingle() in Supabase queries where 0 rows is valid

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Files to process (from explore agent findings, excluding already-fixed files)
const FILES = [
  'src/services/reactions.tsx',
  'src/services/liveWorkouts.tsx',
  'src/services/socialFeed.ts',
  'src/services/coupons.ts',
  'src/services/creatorSubscription.ts',
  'src/services/duels.ts',
  'src/services/shadowBan.ts',
  'src/hooks/useRealtimePosts.ts',
  'src/hooks/useFeedData.tsx',
  'src/hooks/useWorkoutDetail.tsx',
  'src/hooks/useWorkoutPlayer.tsx',
];

let totalReplacements = 0;

for (const file of FILES) {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP (not found): ${file}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const count = (content.match(/\.single\(\)/g) || []).length;

  if (count > 0) {
    content = content.replace(/\.single\(\)/g, '.maybeSingle()');
    fs.writeFileSync(filePath, content, 'utf8');
    totalReplacements += count;
    console.log(`  ${file}: ${count} replacement(s)`);
  }
}

console.log(`\nDone: ${totalReplacements} .single() → .maybeSingle() replacements`);
