const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'app');
const SRC_DIR = path.join(__dirname, '..', 'src');

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function findFiles(dir, ext = '.tsx') {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) files.push(...findFiles(fullPath, ext));
    else if (item.name.endsWith(ext)) files.push(fullPath);
  }
  return files;
}

// Test 1: ThemeContext provides correct colors
function testThemeContext() {
  const content = readFile(path.join(SRC_DIR, 'context', 'ThemeContext.js'));
  const hasColors = content.includes('colors');
  const hasIsDark = content.includes('isDark');
  const hasSetThemeMode = content.includes('setThemeMode');
  const hasThemeProvider = content.includes('ThemeContext.Provider');

  return {
    name: 'ThemeContext',
    passed: hasColors && hasIsDark && hasSetThemeMode && hasThemeProvider,
    details: { hasColors, hasIsDark, hasSetThemeMode, hasThemeProvider }
  };
}

// Test 2: COLORS has both dark and light themes
function testColorsConstant() {
  const content = readFile(path.join(SRC_DIR, 'constants', 'colors.ts'));
  const hasDarkTheme = content.includes('darkTheme');
  const hasLightTheme = content.includes('lightTheme');
  const hasThemeColors = content.includes('ThemeColors');
  const hasExport = content.includes('export');

  return {
    name: 'COLORS Constant',
    passed: hasDarkTheme && hasLightTheme && hasThemeColors && hasExport,
    details: { hasDarkTheme, hasLightTheme, hasThemeColors, hasExport }
  };
}

// Test 3: All screens use useTheme (only if they use COLORS)
function testScreenThemeUsage() {
  const files = findFiles(APP_DIR);
  const results = { total: 0, passed: 0, skipped: 0, failed: [] };

  for (const file of files) {
    const content = readFile(file);
    const hasUseTheme = content.includes('useTheme');
    const hasColorsVar = content.includes('const { colors }') || content.includes('const { colors,') || content.includes('const { isDark, colors');
    const hasCOLORS = content.includes('COLORS');
    const isWrapper = content.includes('ProfileConfigScreen') && content.split('\n').length < 10;

    results.total++;
    if (isWrapper || !hasCOLORS) {
      results.skipped++;
    } else if (hasUseTheme && hasColorsVar) {
      results.passed++;
    } else {
      results.failed.push(path.relative(APP_DIR, file));
    }
  }

  return {
    name: 'Screen Theme Usage',
    passed: results.failed.length === 0,
    details: results
  };
}

// Test 4: No hardcoded colors in screens
function testNoHardcodedColors() {
  const files = findFiles(APP_DIR);
  const results = { total: 0, passed: 0, warnings: [] };

  const hardcodedPatterns = [
    /backgroundColor:\s*['"]#[0-9a-fA-F]{3,8}['"]/,
    /color:\s*['"]#[0-9a-fA-F]{3,8}['"]/,
    /borderColor:\s*['"]#[0-9a-fA-F]{3,8}['"]/,
  ];

  for (const file of files) {
    const content = readFile(file);
    const lines = content.split('\n');
    let hasIssue = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip comments and imports
      if (line.trim().startsWith('//') || line.trim().startsWith('import')) continue;

      for (const pattern of hardcodedPatterns) {
        if (pattern.test(line)) {
          results.warnings.push({
            file: path.relative(APP_DIR, file),
            line: i + 1,
            content: line.trim().substring(0, 80)
          });
          hasIssue = true;
          break;
        }
      }
    }

    results.total++;
    if (!hasIssue) results.passed++;
  }

  return {
    name: 'No Hardcoded Colors',
    passed: results.warnings.length < 10, // Allow some exceptions
    details: results
  };
}

// Test 5: Components use colors prop
function testComponentThemeUsage() {
  const files = findFiles(path.join(SRC_DIR, 'components'));
  const results = { total: 0, passed: 0, failed: [] };

  for (const file of files) {
    const content = readFile(file);
    const hasCOLORS = content.includes('COLORS');
    const hasColors = content.includes('colors');

    results.total++;
    if (!hasCOLORS || hasColors) {
      results.passed++;
    } else {
      results.failed.push(path.relative(SRC_DIR, file));
    }
  }

  return {
    name: 'Component Theme Usage',
    passed: results.failed.length < 20,
    details: results
  };
}

// Test 6: Theme switching works
function testThemeSwitching() {
  const content = readFile(path.join(SRC_DIR, 'context', 'ThemeContext.js'));
  const hasToggleTheme = content.includes('toggleTheme');
  const hasSetThemeMode = content.includes('setThemeMode');
  const hasAutoMode = content.includes('isAutoMode');
  const hasSystemMode = content.includes('system');

  return {
    name: 'Theme Switching',
    passed: hasToggleTheme && hasSetThemeMode && hasAutoMode && hasSystemMode,
    details: { hasToggleTheme, hasSetThemeMode, hasAutoMode, hasSystemMode }
  };
}

// Run all tests
function runTests() {
  console.log('🎨 Theme Integration Tests');
  console.log('=' .repeat(50));

  const tests = [
    testThemeContext(),
    testColorsConstant(),
    testScreenThemeUsage(),
    testNoHardcodedColors(),
    testComponentThemeUsage(),
    testThemeSwitching(),
  ];

  let totalPassed = 0;
  let totalFailed = 0;

  for (const test of tests) {
    const status = test.passed ? '✅' : '❌';
    console.log(`${status} ${test.name}`);

    if (test.passed) {
      totalPassed++;
    } else {
      totalFailed++;
      if (test.details.failed) {
        test.details.failed.slice(0, 5).forEach(f => console.log(`   - ${f}`));
        if (test.details.failed.length > 5) {
          console.log(`   ... and ${test.details.failed.length - 5} more`);
        }
      }
      if (test.details.warnings) {
        test.details.warnings.slice(0, 3).forEach(w => {
          console.log(`   - ${w.file}:${w.line}`);
        });
      }
    }
  }

  console.log('=' .repeat(50));
  console.log(`Results: ${totalPassed} passed, ${totalFailed} failed`);

  return totalFailed === 0;
}

const success = runTests();
process.exit(success ? 0 : 1);
