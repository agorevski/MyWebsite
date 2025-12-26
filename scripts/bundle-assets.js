#!/usr/bin/env node
/**
 * Comprehensive Asset Build Script
 * Handles bundling, minification, and optimization of all JS and CSS assets
 * 
 * Automatically discovers JavaScript and CSS files in Content directory
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
    rootDir: path.join(__dirname, '..'),
    contentDir: path.join(__dirname, '..', 'Content'),
    distDir: path.join(__dirname, '..', 'dist')
};

/**
 * Discover all JavaScript files
 */
function discoverJsFiles() {
    const jsDir = path.join(config.contentDir, 'javascript');
    const vendorsDir = path.join(jsDir, 'vendors');
    
    // Get all vendor .min.js files
    const vendors = fs.existsSync(vendorsDir)
        ? fs.readdirSync(vendorsDir)
            .filter(f => f.endsWith('.min.js'))
            .map(f => `javascript/vendors/${f}`)
        : [];
    
    // Get custom JS files (non-minified, non-vendor)
    const custom = fs.readdirSync(jsDir)
        .filter(f => f.endsWith('.js') && !f.endsWith('.min.js') && fs.statSync(path.join(jsDir, f)).isFile())
        .map(f => `javascript/${f}`);
    
    return { vendors, custom };
}

/**
 * Discover all CSS files
 */
function discoverCssFiles() {
    const cssDir = path.join(config.contentDir, 'stylesheets');
    const vendorsDir = path.join(cssDir, 'vendors');
    
    // Get main stylesheets
    const main = fs.existsSync(cssDir)
        ? fs.readdirSync(cssDir)
            .filter(f => f.endsWith('.css') && fs.statSync(path.join(cssDir, f)).isFile())
            .map(f => `stylesheets/${f}`)
        : [];
    
    // Get vendor stylesheets
    const vendors = fs.existsSync(vendorsDir)
        ? fs.readdirSync(vendorsDir)
            .filter(f => f.endsWith('.css'))
            .map(f => `stylesheets/vendors/${f}`)
        : [];
    
    return { main, vendors };
}

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
    if (fs.existsSync(filePath)) {
        return (fs.statSync(filePath).size / 1024).toFixed(2);
    }
    return 0;
}

/**
 * Bundle and minify JavaScript files using esbuild
 */
function buildJavaScript() {
    console.log('\n📦 Building JavaScript...\n');
    
    // Discover JS files dynamically
    const jsFiles = discoverJsFiles();
    console.log(`  Discovered ${jsFiles.vendors.length} vendor scripts, ${jsFiles.custom.length} custom scripts\n`);
    
    const jsDistDir = path.join(config.distDir, 'javascript');
    const vendorsDistDir = path.join(jsDistDir, 'vendors');
    ensureDir(jsDistDir);
    ensureDir(vendorsDistDir);
    
    // Copy vendor files to dist (already minified)
    console.log('  Copying vendor scripts to dist...');
    for (const vendor of jsFiles.vendors) {
        const src = path.join(config.contentDir, vendor);
        const dest = path.join(config.distDir, vendor);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`    ✓ ${path.basename(vendor)} (${getFileSizeKB(src)} KB)`);
        } else {
            console.warn(`    ⚠ Missing: ${vendor}`);
        }
    }
    
    // Bundle and minify custom JavaScript - output to BOTH dist AND Content
    console.log('\n  Building custom scripts...');
    for (const customFile of jsFiles.custom) {
        const src = path.join(config.contentDir, customFile);
        const destName = customFile.replace('.js', '.min.js');
        const destDist = path.join(config.distDir, destName);
        const destContent = path.join(config.contentDir, destName);
        
        if (fs.existsSync(src)) {
            try {
                // Use ES2020 target for .modern.js files
                const target = customFile.includes('.modern.') ? '--target=es2020' : '';
                // Build to dist
                execSync(`npx esbuild "${src}" --bundle --minify ${target} --outfile="${destDist}"`, {
                    cwd: config.rootDir,
                    stdio: 'pipe'
                });
                // Also copy to Content for HTML references
                fs.copyFileSync(destDist, destContent);
                console.log(`    ✓ ${path.basename(customFile)} → ${path.basename(destName)} (${getFileSizeKB(destDist)} KB)`);
            } catch (err) {
                console.error(`    ✗ Failed to build ${customFile}: ${err.message}`);
            }
        }
    }
    
    console.log('\n  ✅ JavaScript build complete');
}

/**
 * Build and minify CSS files using PostCSS
 */
function buildCSS() {
    console.log('\n🎨 Building CSS...\n');
    
    const cssDistDir = path.join(config.distDir, 'stylesheets');
    const vendorsDistDir = path.join(cssDistDir, 'vendors');
    const contentCssDir = path.join(config.contentDir, 'stylesheets');
    ensureDir(cssDistDir);
    ensureDir(vendorsDistDir);
    
    // Process all CSS files through PostCSS (purge + autoprefixer + cssnano)
    console.log('  Processing stylesheets with PostCSS...');
    
    try {
        // Process main stylesheets (exclude temp files)
        const mainCssFiles = fs.readdirSync(contentCssDir)
            .filter(f => f.endsWith('.css') && 
                        !f.startsWith('_') &&
                        fs.statSync(path.join(contentCssDir, f)).isFile());
        
        for (const cssFile of mainCssFiles) {
            const srcPath = path.join(contentCssDir, cssFile);
            execSync(`npx postcss "${srcPath}" --output "${path.join(cssDistDir, cssFile)}" --no-map`, {
                cwd: config.rootDir,
                stdio: 'pipe'
            });
            console.log(`    ✓ ${cssFile} processed`);
        }
        
        // Process vendor stylesheets
        execSync(`npx postcss "Content/stylesheets/vendors/*.css" --dir "${vendorsDistDir}" --no-map`, {
            cwd: config.rootDir,
            stdio: 'pipe'
        });
        console.log('    ✓ Vendor stylesheets processed');
    } catch (err) {
        console.error(`    ✗ PostCSS failed: ${err.message}`);
        return;
    }
    
    // Calculate total CSS size
    let totalSize = 0;
    const cssFiles = fs.readdirSync(cssDistDir)
        .filter(f => f.endsWith('.css'))
        .map(f => path.join(cssDistDir, f));
    
    const vendorCssFiles = fs.existsSync(vendorsDistDir) 
        ? fs.readdirSync(vendorsDistDir)
            .filter(f => f.endsWith('.css'))
            .map(f => path.join(vendorsDistDir, f))
        : [];
    
    [...cssFiles, ...vendorCssFiles].forEach(f => {
        const size = parseFloat(getFileSizeKB(f));
        totalSize += size;
    });
    
    // Copy processed CSS back to Content directory
    console.log('\n  Syncing processed CSS to Content...');
    const contentVendorsCssDir = path.join(contentCssDir, 'vendors');
    
    // Copy main stylesheets
    cssFiles.forEach(f => {
        const dest = path.join(contentCssDir, path.basename(f));
        fs.copyFileSync(f, dest);
    });
    
    // Copy vendor stylesheets
    vendorCssFiles.forEach(f => {
        const dest = path.join(contentVendorsCssDir, path.basename(f));
        fs.copyFileSync(f, dest);
    });
    console.log('    ✓ CSS synced to Content directory');
    
    console.log(`\n  📊 Total CSS size: ${totalSize.toFixed(2)} KB`);
    console.log('  ✅ CSS build complete');
}

/**
 * Copy assets to dist maintaining structure
 */
function copyAssets() {
    console.log('\n📁 Copying static assets...\n');
    
    // Copy fonts
    const fontsDir = path.join(config.contentDir, 'fonts');
    const fontsDist = path.join(config.distDir, 'fonts');
    
    if (fs.existsSync(fontsDir)) {
        ensureDir(fontsDist);
        copyDirRecursive(fontsDir, fontsDist);
        console.log('  ✓ Fonts copied');
    }
    
    // Copy images
    const imagesDir = path.join(config.contentDir, 'images');
    const imagesDist = path.join(config.distDir, 'images');
    
    if (fs.existsSync(imagesDir)) {
        ensureDir(imagesDist);
        copyDirRecursive(imagesDir, imagesDist);
        console.log('  ✓ Images copied');
    }
}

/**
 * Recursively copy directory
 */
function copyDirRecursive(src, dest) {
    ensureDir(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

/**
 * Generate build summary
 */
function generateSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 BUILD SUMMARY');
    console.log('='.repeat(50));
    
    // Count and size JS files
    const jsDir = path.join(config.distDir, 'javascript');
    const vendorsJsDir = path.join(jsDir, 'vendors');
    let jsCount = 0;
    let jsSize = 0;
    
    if (fs.existsSync(jsDir)) {
        fs.readdirSync(jsDir).forEach(f => {
            if (f.endsWith('.js')) {
                jsCount++;
                jsSize += parseFloat(getFileSizeKB(path.join(jsDir, f)));
            }
        });
    }
    if (fs.existsSync(vendorsJsDir)) {
        fs.readdirSync(vendorsJsDir).forEach(f => {
            if (f.endsWith('.js')) {
                jsCount++;
                jsSize += parseFloat(getFileSizeKB(path.join(vendorsJsDir, f)));
            }
        });
    }
    
    // Count and size CSS files
    const cssDir = path.join(config.distDir, 'stylesheets');
    const vendorsCssDir = path.join(cssDir, 'vendors');
    let cssCount = 0;
    let cssSize = 0;
    
    if (fs.existsSync(cssDir)) {
        fs.readdirSync(cssDir).forEach(f => {
            if (f.endsWith('.css')) {
                cssCount++;
                cssSize += parseFloat(getFileSizeKB(path.join(cssDir, f)));
            }
        });
    }
    if (fs.existsSync(vendorsCssDir)) {
        fs.readdirSync(vendorsCssDir).forEach(f => {
            if (f.endsWith('.css')) {
                cssCount++;
                cssSize += parseFloat(getFileSizeKB(path.join(vendorsCssDir, f)));
            }
        });
    }
    
    console.log(`\n  JavaScript: ${jsCount} files, ${jsSize.toFixed(2)} KB total`);
    console.log(`  CSS: ${cssCount} files, ${cssSize.toFixed(2)} KB total`);
    console.log(`  Total: ${(jsSize + cssSize).toFixed(2)} KB\n`);
}

/**
 * Main build function
 */
function main() {
    console.log('🚀 Asset Build System');
    console.log('='.repeat(50));
    
    const startTime = Date.now();
    
    // Clean dist directory
    console.log('\n🧹 Cleaning dist directory...');
    if (fs.existsSync(config.distDir)) {
        fs.rmSync(config.distDir, { recursive: true });
    }
    ensureDir(config.distDir);
    console.log('  ✓ Clean complete');
    
    // Build steps
    buildJavaScript();
    buildCSS();
    copyAssets();
    generateSummary();
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✨ Build completed in ${elapsed}s\n`);
}

// Run
main();
