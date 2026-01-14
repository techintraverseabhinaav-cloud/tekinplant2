/**
 * Verify Supabase Service Role Key
 * Run with: node scripts/verify-supabase-key.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Supabase Service Role Key...\n');

// Read .env.local
const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.log('\n📝 Create .env.local with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

let supabaseUrl = null;
let serviceKey = null;

lines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = trimmed.split('=')[1]?.trim();
  }
  if (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    serviceKey = trimmed.split('=')[1]?.trim();
  }
});

console.log('📋 Configuration Check:\n');

// Check URL
if (supabaseUrl) {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL: Found');
  console.log(`   Value: ${supabaseUrl.substring(0, 30)}...`);
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    console.log('   ⚠️  Warning: URL format looks incorrect');
  }
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL: Missing');
}

console.log('');

// Check Service Key
if (serviceKey) {
  console.log('✅ SUPABASE_SERVICE_ROLE_KEY: Found');
  console.log(`   Length: ${serviceKey.length} characters`);
  console.log(`   Starts with: ${serviceKey.substring(0, 20)}...`);
  
  // Validate format
  const issues = [];
  
  if (!serviceKey.startsWith('eyJ')) {
    issues.push('❌ Should start with "eyJ" (JWT format)');
  }
  
  if (serviceKey.length < 100) {
    issues.push('⚠️  Key seems too short (should be ~200+ characters)');
  }
  
  if (serviceKey.includes(' ')) {
    issues.push('❌ Key contains spaces (remove quotes if present)');
  }
  
  if (serviceKey.startsWith('"') || serviceKey.startsWith("'")) {
    issues.push('❌ Key is wrapped in quotes (remove quotes)');
  }
  
  if (issues.length === 0) {
    console.log('   ✅ Format looks correct');
  } else {
    console.log('   Issues found:');
    issues.forEach(issue => console.log(`   ${issue}`));
  }
  
  // Check if it's the anon key (common mistake)
  if (serviceKey.includes('sb_publishable_') || serviceKey.includes('sb_')) {
    console.log('   ❌ This looks like a publishable key, not service_role key!');
    console.log('   ⚠️  Service role key should start with "eyJ" (JWT token)');
  }
  
} else {
  console.log('❌ SUPABASE_SERVICE_ROLE_KEY: Missing');
  console.log('\n📝 How to get your Service Role Key:');
  console.log('   1. Go to https://app.supabase.com');
  console.log('   2. Select your project');
  console.log('   3. Go to Settings → API');
  console.log('   4. Find "service_role" under "Project API keys"');
  console.log('   5. Click "Reveal" and copy the key');
  console.log('   6. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your-key-here');
}

console.log('\n💡 Tips:');
console.log('   - Service role key should be a JWT token (starts with "eyJ")');
console.log('   - It should be ~200+ characters long');
console.log('   - Never commit this key to git!');
console.log('   - Restart dev server after updating .env.local\n');

