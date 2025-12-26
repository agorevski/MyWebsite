#!/usr/bin/env node
/**
 * Critical CSS Extraction Script
 * 
 * Uses the 'critical' npm package to automatically extract and inline
 * above-the-fold CSS, eliminating manual maintenance of inline critical styles.
 * 
 * This script:
 * 1. Analyzes index.html to extract critical CSS for above-the-fold content
 * 2. Generates a new HTML file with inlined critical CSS
 * 3. Async-loads non-critical CSS for better performance
 */

import { generate } from 'critical';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');

// Configuration for critical CSS extraction
const config = {
    // Source HTML file
    src: path.join(rootDir, 'index.html'),
    
    // Target dimensions for above-the-fold extraction
    // Multiple dimensions ensure coverage across devices
    dimensions: [
        { width: 320, height: 480 },   // Mobile portrait
        { width: 768, height: 1024 },  // Tablet
        { width: 1280, height: 800 },  // Desktop
        { width: 1920, height: 1080 }, // Large desktop
    ],
    
    // Include inline styles from the page
    inline: false,
    
    // Extract mode - returns CSS without modifying HTML
    extract: true,
    
    // CSS sources to analyze
    css: [
        path.join(rootDir, 'Content', 'stylesheets', 'critical.min.css'),
        path.join(rootDir, 'Content', 'stylesheets', 'async-noncritical.min.css'),
        path.join(rootDir, 'Content', 'stylesheets', 'vendors', 'bootstrap5.min.css'),
    ].filter(f => fs.existsSync(f)),
    
    // Penthouse options for CSS extraction
    penthouse: {
        timeout: 60000,
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    }
};

/**
 * Generate inlined critical CSS HTML
 */
async function generateCriticalCSS() {
    console.log('🎯 Critical CSS Extraction');
    console.log('='.repeat(50));
    
    try {
        console.log('\n📊 Analyzing above-the-fold content...');
        console.log(`   Source: ${path.basename(config.src)}`);
        console.log(`   Dimensions: ${config.dimensions.map(d => `${d.width}x${d.height}`).join(', ')}`);
        
        // Generate critical CSS
        let { css, html } = await generate({
            src: config.src,
            dimensions: config.dimensions,
            inline: true,
            extract: false,
            css: config.css,
            penthouse: config.penthouse,
            // Keep existing async CSS loading
            assetPaths: [
                path.join(rootDir, 'Content'),
                path.join(rootDir, 'Content', 'stylesheets'),
                path.join(rootDir, 'Content', 'stylesheets', 'vendors'),
            ],
            // Rebase URLs for fonts and images
            rebase: {
                from: path.join(rootDir),
                to: path.join(rootDir)
            }
        });
        
        // Fix font paths: ../fonts/ -> Content/fonts/ (for inline styles in root HTML)
        // The CSS files are in Content/stylesheets/, so ../fonts/ points to Content/fonts/
        // But when inlined in index.html (at root), we need Content/fonts/
        html = html.replace(/url\(\.\.\/fonts\//g, 'url(Content/fonts/');
        html = html.replace(/url\("\.\.\/fonts\//g, 'url("Content/fonts/');
        html = html.replace(/url\('\.\.\/fonts\//g, "url('Content/fonts/");
        
        // Also fix image paths: ../images/ -> Content/images/
        html = html.replace(/url\(\.\.\/images\//g, 'url(Content/images/');
        html = html.replace(/url\("\.\.\/images\//g, 'url("Content/images/');
        html = html.replace(/url\('\.\.\/images\//g, "url('Content/images/");
        
        console.log('   Fixed relative paths for fonts and images');
        
        // Write the optimized HTML
        const outputPath = path.join(rootDir, 'index.critical.html');
        fs.writeFileSync(outputPath, html);
        
        console.log('\n✅ Critical CSS extracted successfully!');
        console.log(`   Output: ${path.basename(outputPath)}`);
        console.log(`   Critical CSS size: ${(Buffer.byteLength(css || '', 'utf8') / 1024).toFixed(2)} KB`);
        
        // Also save standalone critical CSS for reference
        const criticalCssPath = path.join(rootDir, 'Content', 'stylesheets', 'generated-critical.css');
        if (css) {
            fs.writeFileSync(criticalCssPath, css);
            console.log(`   Standalone CSS saved: Content/stylesheets/generated-critical.css`);
        }
        
        console.log('\n💡 To use the optimized version:');
        console.log('   1. Review index.critical.html');
        console.log('   2. Replace index.html with index.critical.html if satisfied');
        console.log('   Or run: npm run critical:apply\n');
        
        return { css, html };
    } catch (error) {
        console.error('\n❌ Critical CSS extraction failed:', error.message);
        console.error('\nTroubleshooting:');
        console.error('  - Ensure the website is accessible (run npm run serve first)');
        console.error('  - Check that CSS files exist in Content/stylesheets/');
        throw error;
    }
}

/**
 * Apply critical CSS to index.html (backup original first)
 */
async function applyCriticalCSS() {
    const criticalHtmlPath = path.join(rootDir, 'index.critical.html');
    const indexPath = path.join(rootDir, 'index.html');
    const backupPath = path.join(rootDir, 'index.backup.html');
    
    if (!fs.existsSync(criticalHtmlPath)) {
        console.error('❌ index.critical.html not found. Run npm run critical:generate first.');
        process.exit(1);
    }
    
    // Backup original
    fs.copyFileSync(indexPath, backupPath);
    console.log('📦 Backed up index.html to index.backup.html');
    
    // Apply critical version
    fs.copyFileSync(criticalHtmlPath, indexPath);
    console.log('✅ Applied critical CSS to index.html');
    
    // Clean up
    fs.unlinkSync(criticalHtmlPath);
    console.log('🧹 Removed temporary index.critical.html');
}

// CLI handling
const args = process.argv.slice(2);
const command = args[0] || 'generate';

if (command === 'generate') {
    generateCriticalCSS().catch(() => process.exit(1));
} else if (command === 'apply') {
    applyCriticalCSS();
} else {
    console.log('Usage: node extract-critical-css.js [generate|apply]');
    console.log('  generate - Extract critical CSS and create index.critical.html');
    console.log('  apply    - Apply critical CSS to index.html (with backup)');
}
