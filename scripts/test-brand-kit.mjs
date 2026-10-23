// Automated verification test suite for Brand Kit logic, validation & completion rules
import assert from 'node:assert';

// 1. Brand Kit validation & completion rules
function isValidHex(hex) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

function formatHex(hex) {
  if (!hex) return "#000000";
  let cleaned = hex.trim();
  if (!cleaned.startsWith("#")) {
    cleaned = "#" + cleaned;
  }
  return cleaned.toUpperCase();
}

function isBrandKitComplete(brandKit, business) {
  if (!brandKit) return false;
  const hasColors = Boolean(brandKit.primary_color && brandKit.secondary_color);
  const hasFont = Boolean(brandKit.font);
  const hasName = Boolean(business?.name || brandKit.business_name);
  return Boolean(hasColors && hasFont && hasName);
}

function shouldOpenAutomaticModal({ user, pathname, brandKit, business, sessionDismissed }) {
  if (!user) return false;
  const role = user.role?.toLowerCase()?.trim();
  // Only Businessman gets automatic popup
  if (role !== 'businessman' && role !== 'business' && role !== 'merchant') {
    return false;
  }
  // Do not popup over the dedicated /brand page
  if (pathname === '/brand') {
    return false;
  }
  // Do not popup if already dismissed in the current session
  if (sessionDismissed) {
    return false;
  }
  // Open if incomplete
  return !isBrandKitComplete(brandKit, business);
}

console.log('🧪 Starting Brand Kit Verification Test Suite...\n');

// Test 1: Hex validation and formatting
console.log('Test 1: Hex Color Validation & Formatting');
assert.strictEqual(isValidHex('#BE32FF'), true);
assert.strictEqual(isValidHex('#be32ff'), true);
assert.strictEqual(isValidHex('#FFF'), true);
assert.strictEqual(isValidHex('#123456'), true);
assert.strictEqual(isValidHex('BE32FF'), false, 'Missing # prefix should fail isValidHex');
assert.strictEqual(isValidHex('#12345G'), false, 'Invalid character G should fail');
assert.strictEqual(isValidHex('red'), false);

assert.strictEqual(formatHex('BE32FF'), '#BE32FF');
assert.strictEqual(formatHex('#be32ff'), '#BE32FF');
assert.strictEqual(formatHex('123'), '#123');
assert.strictEqual(formatHex(''), '#000000');
console.log('✅ Passed: Hex Color Validation & Formatting\n');

// Test 2: Brand Kit Completion Rules
console.log('Test 2: Brand Kit Completion Rules');
assert.strictEqual(isBrandKitComplete(null, null), false, 'Null Brand Kit is incomplete');
assert.strictEqual(
  isBrandKitComplete({ primary_color: '#BE32FF' }, { name: 'My Shop' }),
  false,
  'Missing font is incomplete'
);
assert.strictEqual(
  isBrandKitComplete({ primary_color: '#521a0fff', font: 'Inter' }, null),
  false,
  'Missing business name is incomplete'
);
assert.strictEqual(
  isBrandKitComplete(
    { primary_color: '#BE32FF', secondary_color: '#F0449B', font: 'Inter' },
    { name: 'Sharma Textiles' }
  ),
  true,
  'Brand Kit with primary, secondary, font, and business name is complete'
);
assert.strictEqual(
  isBrandKitComplete(
    { primary_color: '#BE32FF', secondary_color: '#F0449B', font: 'Inter', business_name: 'Sharma Textiles' },
    null
  ),
  true,
  'Brand Kit with business_name embedded is complete'
);
console.log('✅ Passed: Brand Kit Completion Rules\n');

// Test 3: Automatic Modal Display Logic
console.log('Test 3: Automatic Modal Display Logic (Businessman vs Influencer vs Completed)');
// Scenario 3a: Businessman with incomplete brand kit
assert.strictEqual(
  shouldOpenAutomaticModal({
    user: { id: 'u1', role: 'businessman' },
    pathname: '/dashboard',
    brandKit: null,
    business: null,
    sessionDismissed: false,
  }),
  true,
  'Businessman with incomplete brand kit MUST trigger automatic modal'
);

// Scenario 3b: Businessman with completed brand kit
assert.strictEqual(
  shouldOpenAutomaticModal({
    user: { id: 'u1', role: 'businessman' },
    pathname: '/dashboard',
    brandKit: { primary_color: '#BE32FF', secondary_color: '#F0449B', font: 'Inter' },
    business: { name: 'Store' },
    sessionDismissed: false,
  }),
  false,
  'Businessman with complete brand kit must NOT trigger modal'
);

// Scenario 3c: Influencer account should NEVER get businessman popup
assert.strictEqual(
  shouldOpenAutomaticModal({
    user: { id: 'u2', role: 'influencer' },
    pathname: '/influencer',
    brandKit: null,
    business: null,
    sessionDismissed: false,
  }),
  false,
  'Influencer account must never trigger businessman modal'
);

// Scenario 3d: Dismissed in current mounted session
assert.strictEqual(
  shouldOpenAutomaticModal({
    user: { id: 'u1', role: 'businessman' },
    pathname: '/dashboard',
    brandKit: null,
    business: null,
    sessionDismissed: true,
  }),
  false,
  'Modal dismissed in current mounted session must not repeatedly reopen'
);

// Scenario 3e: On dedicated /brand page
assert.strictEqual(
  shouldOpenAutomaticModal({
    user: { id: 'u1', role: 'businessman' },
    pathname: '/brand',
    brandKit: null,
    business: null,
    sessionDismissed: false,
  }),
  false,
  'Modal must not popup on top of the /brand page itself'
);

console.log('✅ Passed: Automatic Modal Display Logic\n');

console.log('🎉 ALL BRAND KIT TESTS PASSED PERFECTLY!\n');
