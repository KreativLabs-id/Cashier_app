#!/usr/bin/env node

/**
 * Pre-deployment checklist script
 * Run before deploying to Vercel
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-deployment checks...\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: Required files exist
console.log('📁 Checking required files...');
const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'public/manifest.json',
  'public/icon-192x192.png',
  'public/icon-512x512.png',
  'public/favicon.ico',
  '.env.example'
];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ✗ ${file} - MISSING!`);
    hasErrors = true;
  }
});

// Check 2: Environment variables
console.log('\n🔐 Checking environment variables...');
const envExample = path.join(process.cwd(), '.env.example');
if (fs.existsSync(envExample)) {
  const envContent = fs.readFileSync(envExample, 'utf8');
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`  ✓ ${varName} documented in .env.example`);
    } else {
      console.log(`  ⚠ ${varName} not found in .env.example`);
      hasWarnings = true;
    }
  });
}

// Check 3: Build test
console.log('\n🔨 Checking if build succeeds...');
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  console.log('  ✓ Build artifacts found (.next directory exists)');
  console.log('  💡 Run "npm run build" to ensure latest build');
} else {
  console.log('  ⚠ No build artifacts found');
  console.log('  💡 Run "npm run build" before deploying');
  hasWarnings = true;
}

// Check 4: PWA files
console.log('\n📱 Checking PWA configuration...');
const pwaFiles = [
  'public/manifest.json',
  'public/icon-192x192.png',
  'public/icon-512x512.png',
  'public/apple-touch-icon.png'
];

pwaFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`  ✓ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  } else {
    console.log(`  ✗ ${file} - MISSING!`);
    hasErrors = true;
  }
});

// Check 5: Package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['build', 'start', 'dev'];

requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`  ✓ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`  ✗ ${script} script missing!`);
    hasErrors = true;
  }
});

// Check 6: Dependencies
console.log('\n📚 Checking critical dependencies...');
const criticalDeps = [
  'next',
  'react',
  'next-pwa',
  '@neondatabase/serverless',
  'jose'
];

criticalDeps.forEach(dep => {
  if (packageJson.dependencies && packageJson.dependencies[dep]) {
    console.log(`  ✓ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`  ✗ ${dep} not found in dependencies!`);
    hasErrors = true;
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Pre-deployment check FAILED!');
  console.log('   Please fix the errors above before deploying.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Pre-deployment check completed with warnings.');
  console.log('   Review warnings above, but you can proceed with deployment.');
  process.exit(0);
} else {
  console.log('✅ All checks passed! Ready to deploy!');
  console.log('\n📝 Next steps:');
  console.log('   1. Run: vercel login');
  console.log('   2. Run: npm run deploy:preview (for testing)');
  console.log('   3. Run: npm run deploy (for production)');
  console.log('\n🚀 Happy deploying!');
  process.exit(0);
}
