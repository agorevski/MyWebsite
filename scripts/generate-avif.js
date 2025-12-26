/**
 * AVIF Image Generator
 * Converts WebP and PNG images to AVIF format for better compression
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagePaths = [
  // Profile images
  { input: 'Images/profile/profile.webp', output: 'Images/profile/profile.avif' },
  { input: 'Images/profile/profile-small.webp', output: 'Images/profile/profile-small.avif' },
  { input: 'Images/profile/profile-medium.webp', output: 'Images/profile/profile-medium.avif' },
  
  // Background images
  { input: 'Content/images/backgrounds/background-large.webp', output: 'Content/images/backgrounds/background-large.avif' },
  { input: 'Content/images/backgrounds/background-medium.webp', output: 'Content/images/backgrounds/background-medium.avif' },
  { input: 'Content/images/backgrounds/background-small.webp', output: 'Content/images/backgrounds/background-small.avif' },
  
  // Icon images
  { input: 'Images/icons/layers.webp', output: 'Images/icons/layers.avif' },
  { input: 'Images/icons/book.webp', output: 'Images/icons/book.avif' },
  { input: 'Images/icons/heart.webp', output: 'Images/icons/heart.avif' },
  { input: 'Images/icons/scroll.png', output: 'Images/icons/scroll.avif' },
  
  // Timeline images
  { input: 'Images/timeline/classhawk.webp', output: 'Images/timeline/classhawk.avif' },
];

async function convertToAvif(inputPath, outputPath) {
  try {
    const fullInputPath = path.join(process.cwd(), inputPath);
    const fullOutputPath = path.join(process.cwd(), outputPath);
    
    if (!fs.existsSync(fullInputPath)) {
      console.log(`⚠ Skipping ${inputPath} - file not found`);
      return;
    }
    
    await sharp(fullInputPath)
      .avif({ quality: 65, effort: 6 }) // Quality 65 gives good balance of size/quality
      .toFile(fullOutputPath);
    
    const inputStats = fs.statSync(fullInputPath);
    const outputStats = fs.statSync(fullOutputPath);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
    
    console.log(`✓ ${inputPath} -> ${outputPath} (${savings}% smaller)`);
  } catch (error) {
    console.error(`✗ Error converting ${inputPath}:`, error.message);
  }
}

async function main() {
  console.log('Generating AVIF images...\n');
  
  for (const { input, output } of imagePaths) {
    await convertToAvif(input, output);
  }
  
  console.log('\nDone!');
}

main();
