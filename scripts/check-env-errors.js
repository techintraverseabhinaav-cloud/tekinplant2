const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for environment variable errors...\n');

const errors = [];

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  errors.push('❌ .env.local file not found');
} else {
  console.log('✅ .env.local file exists');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  // Check for common issues
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    
    // Check for missing quotes around values with special characters
    if (trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      
      // Check if value has spaces and isn't quoted
      if (value.includes(' ') && !value.startsWith('"') && !value.startsWith("'")) {
        errors.push(`Line ${i+1}: Value for ${key.trim()} contains spaces but isn't quoted`);
      }
      
      // Check for trailing spaces
      if (key.endsWith(' ') || value.startsWith(' ')) {
        errors.push(`Line ${i+1}: Trailing/leading spaces in ${key.trim()}`);
      }
    }
  });
}

// Check required variables
const requiredVars = {
  'NEXT_PUBLIC_SUPABASE_URL': 'Supabase Project URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Supabase Anonymous Key',
  'SUPABASE_SERVICE_ROLE_KEY': 'Supabase Service Role Key',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': 'Clerk Publishable Key',
  'CLERK_SECRET_KEY': 'Clerk Secret Key'
};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  Object.keys(requiredVars).forEach(varName => {
    const regex = new RegExp(`^${varName}=`, 'm');
    if (!regex.test(envContent)) {
      errors.push(`❌ Missing: ${varName} (${requiredVars[varName]})`);
    }
  });
}

// Check for TypeScript non-null assertion issues
const filesToCheck = [
  'lib/supabase/client.ts',
  'lib/supabase/server.ts'
];

const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

filesToCheck.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('process.env.') && content.includes('!')) {
      // Check if variables are properly validated
      const envVars = content.match(/process\.env\.([A-Z_]+)!/g);
      if (envVars) {
        envVars.forEach(match => {
          const varName = match.match(/process\.env\.([A-Z_]+)!/)[1];
          if (!envContent || !envContent.includes(`${varName}=`)) {
            errors.push(`⚠️  ${file}: Uses ${varName} with ! but may be undefined`);
          }
        });
      }
    }
  }
});

// Display results
if (errors.length === 0) {
  console.log('✅ No errors found!\n');
  console.log('All required environment variables are present:');
  Object.keys(requiredVars).forEach(varName => {
    console.log(`  ✅ ${varName}`);
  });
} else {
  console.log(`❌ Found ${errors.length} error(s):\n`);
  errors.forEach((err, i) => {
    console.log(`${i + 1}. ${err}`);
  });
  console.log('\n📋 Required variables:');
  Object.keys(requiredVars).forEach(varName => {
    const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    const status = envContent.includes(`${varName}=`) ? '✅' : '❌';
    console.log(`  ${status} ${varName} - ${requiredVars[varName]}`);
  });
}

process.exit(errors.length > 0 ? 1 : 0);

