const { execSync } = require('child_process');
const suites = [
  '__tests__/services/gamification.test.js',
  '__tests__/services/analytics.test.js', 
  '__tests__/services/coupon.test.js',
  '__tests__/services/eventTracker.test.js',
  '__tests__/services/notifications.test.js',
  '__tests__/services/referral.test.js',
  '__tests__/services/workoutSaver.test.js',
  '__tests__/services/xp-achievements.test.js',
  '__tests__/services/lgpd.test.js',
  '__tests__/services/gemini.test.js',
  '__tests__/services/offline.test.js',
  '__tests__/components/admin.test.js',
  '__tests__/components/contextualCard.test.js',
  '__tests__/components/offlineSettings.test.js',
  '__tests__/constants/colors.test.js',
  '__tests__/screens/library.test.js',
  '__tests__/screens/planner.test.js',
  '__tests__/screens/screens.test.js',
  '__tests__/screens/screens10.test.js',
  '__tests__/screens/screens11.test.js',
  '__tests__/screens/screens2.test.js',
  '__tests__/screens/screens4.test.js',
  '__tests__/screens/screens5.test.js',
  '__tests__/screens/screens9.test.js',
  '__tests__/screens/tabs.test.js',
  'src/__tests__/dates.test.ts',
];

for (const s of suites) {
  try {
    const out = execSync(`npx jest --no-coverage --forceExit "${s}" 2>&1`, { encoding: 'utf8', timeout: 30000, maxBuffer: 50000 });
    const firstError = out.split('\n').find(l => l.includes('is not a function') || l.includes('is not defined') || l.includes('Cannot find') || l.includes('Module not found') || l.includes('not exported'));
    if (firstError) console.log(`${s.split('/').pop()}: ${firstError.trim().substring(0, 120)}`);
    else if (out.includes('PASS')) console.log(`${s.split('/').pop()}: PASS`);
    else console.log(`${s.split('/').pop()}: OTHER ERROR`);
  } catch(e) {
    const msg = e.stdout || '';
    const firstError = msg.split('\n').find(l => l.includes('is not a function') || l.includes('is not defined') || l.includes('Cannot find') || l.includes('not exported'));
    if (firstError) console.log(`${s.split('/').pop()}: ${firstError.trim().substring(0, 120)}`);
    else console.log(`${s.split('/').pop()}: FAIL (other)`);
  }
}
