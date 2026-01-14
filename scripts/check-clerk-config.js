// Quick script to check Clerk configuration
const fs = require('fs')
const path = require('path')

console.log('🔍 Checking Clerk Configuration...\n')

// Check .env.local
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const publishableKey = envContent.match(/NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=(.+)/)?.[1]
  const secretKey = envContent.match(/CLERK_SECRET_KEY=(.+)/)?.[1]
  
  if (publishableKey) {
    console.log('✅ Publishable Key found:', publishableKey.substring(0, 20) + '...')
    if (publishableKey.startsWith('pk_live_')) {
      console.log('   → Production key detected')
    } else if (publishableKey.startsWith('pk_test_')) {
      console.log('   → Development key detected')
    } else {
      console.log('   ⚠️  Invalid key format (should start with pk_live_ or pk_test_)')
    }
  } else {
    console.log('❌ Publishable Key NOT found')
  }
  
  if (secretKey) {
    console.log('✅ Secret Key found:', secretKey.substring(0, 20) + '...')
  } else {
    console.log('❌ Secret Key NOT found')
  }
} else {
  console.log('❌ .env.local file not found')
}

// Check package.json
const packagePath = path.join(process.cwd(), 'package.json')
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  const clerkVersion = packageJson.dependencies?.['@clerk/nextjs']
  if (clerkVersion) {
    console.log('\n✅ @clerk/nextjs version:', clerkVersion)
  } else {
    console.log('\n❌ @clerk/nextjs not found in dependencies')
  }
}

console.log('\n📋 Next Steps:')
console.log('1. Verify keys in Clerk Dashboard: https://dashboard.clerk.com')
console.log('2. Check if domain is configured correctly in Clerk Dashboard')
console.log('3. Restart dev server after any .env.local changes')
console.log('4. Clear browser cache (Ctrl+Shift+R)')

