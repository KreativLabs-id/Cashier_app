/**
 * Script untuk generate password hash menggunakan bcryptjs
 * Jalankan dengan: node scripts/generate-password-hash.js
 */

const bcrypt = require('bcryptjs');

async function generateHashes() {
  console.log('🔐 Generating password hashes...\n');
  
  // Generate hash untuk admin (password: admin123)
  const adminHash = await bcrypt.hash('admin123', 10);
  console.log('Admin Password Hash:');
  console.log(adminHash);
  console.log('');
  
  // Generate hash untuk kasir (password: kasir123)
  const kasirHash = await bcrypt.hash('kasir123', 10);
  console.log('Kasir Password Hash:');
  console.log(kasirHash);
  console.log('');
  
  console.log('✅ Done! Copy hash di atas ke complete-schema.sql');
  console.log('');
  console.log('📝 SQL untuk insert users:');
  console.log('');
  console.log(`INSERT INTO users (email, password_hash, name, role, is_active) VALUES`);
  console.log(`  ('admin@tiptop.com', '${adminHash}', 'Admin Tip Top', 'admin', true),`);
  console.log(`  ('kasir@tiptop.com', '${kasirHash}', 'Kasir Tip Top', 'kasir', true)`);
  console.log(`ON CONFLICT (email) DO NOTHING;`);
}

generateHashes().catch(console.error);
