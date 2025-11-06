const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const logoPath = path.join(publicDir, 'logotiptop.png');

// Icon sizes untuk PWA
const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 256, name: 'icon-256x256.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' },
];

async function generateIcons() {
  console.log('📱 Generating PWA icons from logotiptop.png...\n');

  // Check if logo exists
  if (!fs.existsSync(logoPath)) {
    console.error('❌ Error: logotiptop.png not found in public folder!');
    process.exit(1);
  }

  try {
    // Generate each size
    for (const { size, name } of sizes) {
      const outputPath = path.join(publicDir, name);
      
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 239, g: 68, b: 68, alpha: 1 } // Red background matching logo
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated: ${name} (${size}x${size})`);
    }

    // Generate favicon.ico (using 32x32 as base)
    const faviconPath = path.join(publicDir, 'favicon.ico');
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 239, g: 68, b: 68, alpha: 1 }
      })
      .png()
      .toFile(faviconPath);
    
    console.log('✓ Generated: favicon.ico');

    console.log('\n✅ All icons generated successfully!');
    console.log('\n📝 Generated files:');
    console.log('   - icon-192x192.png');
    console.log('   - icon-256x256.png');
    console.log('   - icon-384x384.png');
    console.log('   - icon-512x512.png');
    console.log('   - apple-touch-icon.png');
    console.log('   - favicon-32x32.png');
    console.log('   - favicon-16x16.png');
    console.log('   - favicon.ico');
    console.log('\n🚀 Ready to build and deploy!');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();
