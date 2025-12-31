const fs = require('fs');
const path = require('path');

console.log('🔍 Validating .env.local file...\n');

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

const errors = [];
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY'
];

const foundVars = new Set();

lines.forEach((line, i) => {
  const trimmed = line.trim();
  
  // Skip empty lines and comments
  if (!trimmed || trimmed.startsWith('#')) {
    return;
  }
  
  // Check for missing equals sign
  if (!trimmed.includes('=')) {
    errors.push({
      line: i + 1,
      error: 'Missing equals sign',
      content: trimmed
    });
    return;
  }
  
  const [key, ...valueParts] = trimmed.split('=');
  const keyTrimmed = key.trim();
  const value = valueParts.join('=').trim();
  
  // Check for empty key
  if (!keyTrimmed) {
    errors.push({
      line: i + 1,
      error: 'Empty key name',
      content: trimmed
    });
    return;
  }
  
  // Check for spaces in key
  if (keyTrimmed.includes(' ')) {
    errors.push({
      line: i + 1,
      error: 'Key contains spaces',
      content: keyTrimmed
    });
  }
  
  // Check for empty value
  if (!value || value === '') {
    errors.push({
      line: i + 1,
      error: `Empty value for ${keyTrimmed}`,
      content: trimmed
    });
  }
  
  // Check for placeholder values
  if (value.includes('your-') || value.includes('your_') || value === 'your-key-here' || value === 'your-url-here') {
    errors.push({
      line: i + 1,
      error: `Placeholder value not replaced for ${keyTrimmed}`,
      content: keyTrimmed
    });
  }
  
  // Track found variables
  foundVars.add(keyTrimmed);
});

// Check for missing required variables
requiredVars.forEach(varName => {
  if (!foundVars.has(varName)) {
    errors.push({
      line: 'N/A',
      error: `Missing required variable: ${varName}`,
      content: varName
    });
  }
});

// Display results
if (errors.length === 0) {
  console.log('✅ No errors found in .env.local file!\n');
  console.log('Found variables:');
  foundVars.forEach(v => console.log(`  ✅ ${v}`));
} else {
  console.log(`❌ Found ${errors.length} error(s):\n`);
  errors.forEach((err, index) => {
    console.log(`${index + 1}. Line ${err.line}: ${err.error}`);
    console.log(`   Variable: ${err.content}\n`);
  });
  
  console.log('\n📋 Required variables:');
  requiredVars.forEach(v => {
    const status = foundVars.has(v) ? '✅' : '❌';
    console.log(`  ${status} ${v}`);
  });
  
  process.exit(1);
}

