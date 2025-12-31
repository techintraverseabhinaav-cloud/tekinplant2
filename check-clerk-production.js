// Quick script to check Clerk production mode setup
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Clerk Production Mode Setup...\n');

// Check .env.local file
const envPath = path.join(process.cwd(), '.env.local');
let hasEnvFile = false;
let hasProductionKeys = false;
let hasTestKeys = false;

if (fs.existsSync(envPath)) {
  hasEnvFile = true;
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check for production keys
  if (envContent.includes('pk_live_') && envContent.includes('sk_live_')) {
    hasProductionKeys = true;
    console.log('✅ Production keys found in .env.local');
    console.log('   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: pk_live_...');
    console.log('   - CLERK_SECRET_KEY: sk_live_...');
  }
  
  // Check for test keys
  if (envContent.includes('pk_test_') || envContent.includes('sk_test_')) {
    hasTestKeys = true;
    console.log('⚠️  Test/Development keys found in .env.local');
  }
} else {
  console.log('❌ .env.local file not found');
}

// Check middleware.ts
const middlewarePath = path.join(process.cwd(), 'middleware.ts');
if (fs.existsSync(middlewarePath)) {
  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  if (middlewareContent.includes('clerkMiddleware')) {
    console.log('✅ Middleware is configured correctly');
  }
} else {
  console.log('❌ middleware.ts not found');
}

// Check layout.tsx
const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (layoutContent.includes('ClerkProvider')) {
    console.log('✅ ClerkProvider is configured in layout.tsx');
  }
} else {
  console.log('❌ app/layout.tsx not found');
}

// Summary
console.log('\n📊 Summary:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (hasProductionKeys) {
  console.log('✅ PRODUCTION MODE: Configured');
  console.log('\n📝 Next Steps:');
  console.log('   1. Verify keys are also set in your production hosting platform');
  console.log('   2. Configure allowed URLs in Clerk Dashboard');
  console.log('   3. Test sign-in/sign-up on production');
} else if (hasTestKeys) {
  console.log('⚠️  DEVELOPMENT MODE: Currently using test keys');
  console.log('\n📝 To switch to production:');
  console.log('   1. Get production keys from Clerk Dashboard');
  console.log('   2. Replace pk_test_/sk_test_ with pk_live_/sk_live_');
  console.log('   3. See CLERK_PRODUCTION_SETUP.md for details');
} else {
  console.log('❌ Clerk keys not found');
  console.log('\n📝 Setup required:');
  console.log('   1. Create .env.local file');
  console.log('   2. Add Clerk API keys');
  console.log('   3. See CLERK_SETUP.md for details');
}

console.log('\n');

