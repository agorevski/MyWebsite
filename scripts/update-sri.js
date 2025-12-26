#!/usr/bin/env node
/**
 * SRI (Subresource Integrity) Hash Updater
 * Automatically calculates and updates SRI hashes in HTML files
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const config = {
    htmlFile: path.join(__dirname, '..', 'index.html'),
    // JS files to generate SRI hashes for (relative to project root)
    // Note: jQuery removed - using vanilla JS in custom.modern.js
    jsFiles: [
        'Content/javascript/custom.modern.js',
        'Content/javascript/vendors/bootstrap5.bundle.min.js',
        'Content/javascript/vendors/materialize.min.js',
        'Content/javascript/vendors/scrollreveal.min.js'
    ],
    // CSS files to generate SRI hashes for (relative to project root)
    cssFiles: [
        'Content/stylesheets/vendors/bootstrap5.min.css',
        'Content/stylesheets/async-noncritical.min.css',
        'Content/stylesheets/critical.min.css'
    ]
};

/**
 * Calculate SHA-384 hash for a file
 * @param {string} filePath - Path to the file
 * @returns {string} SRI hash string
 */
function calculateSRI(filePath) {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.warn(`Warning: File not found: ${filePath}`);
        return null;
    }
    
    const content = fs.readFileSync(fullPath);
    const hash = crypto.createHash('sha384').update(content).digest('base64');
    return `sha384-${hash}`;
}

/**
 * Update SRI hash in HTML content for script tags
 * @param {string} html - HTML content
 * @param {string} filePath - Path to the file (used to find the script tag)
 * @param {string} newHash - New SRI hash
 * @returns {string} Updated HTML content
 */
function updateScriptSRIInHTML(html, filePath, newHash) {
    // Escape special regex characters in file path
    const escapedPath = filePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Match script tags with this src and an integrity attribute
    const scriptRegex = new RegExp(
        `(<script[^>]*src=["']${escapedPath}["'][^>]*integrity=["'])([^"']+)(["'][^>]*>)`,
        'g'
    );
    
    // Also match if integrity comes before src
    const scriptRegexAlt = new RegExp(
        `(<script[^>]*integrity=["'])([^"']+)(["'][^>]*src=["']${escapedPath}["'][^>]*>)`,
        'g'
    );
    
    let updated = html.replace(scriptRegex, `$1${newHash}$3`);
    updated = updated.replace(scriptRegexAlt, `$1${newHash}$3`);
    
    return updated;
}

/**
 * Update SRI hash in HTML content for link tags (CSS)
 * @param {string} html - HTML content
 * @param {string} filePath - Path to the file (used to find the link tag)
 * @param {string} newHash - New SRI hash
 * @returns {string} Updated HTML content
 */
function updateLinkSRIInHTML(html, filePath, newHash) {
    // Escape special regex characters in file path
    const escapedPath = filePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Match link tags with this href and an integrity attribute
    const linkRegex = new RegExp(
        `(<link[^>]*href=["']${escapedPath}["'][^>]*integrity=["'])([^"']+)(["'][^>]*>)`,
        'g'
    );
    
    // Also match if integrity comes before href
    const linkRegexAlt = new RegExp(
        `(<link[^>]*integrity=["'])([^"']+)(["'][^>]*href=["']${escapedPath}["'][^>]*>)`,
        'g'
    );
    
    let updated = html.replace(linkRegex, `$1${newHash}$3`);
    updated = updated.replace(linkRegexAlt, `$1${newHash}$3`);
    
    return updated;
}

/**
 * Main function
 */
function main() {
    console.log('🔐 SRI Hash Updater\n');
    
    // Read HTML file
    if (!fs.existsSync(config.htmlFile)) {
        console.error(`Error: HTML file not found: ${config.htmlFile}`);
        process.exit(1);
    }
    
    let html = fs.readFileSync(config.htmlFile, 'utf8');
    let updatedCount = 0;
    
    // Process JS files
    console.log('📜 Processing JavaScript files...\n');
    for (const filePath of config.jsFiles) {
        const hash = calculateSRI(filePath);
        
        if (hash) {
            const originalHTML = html;
            html = updateScriptSRIInHTML(html, filePath, hash);
            
            if (html !== originalHTML) {
                console.log(`✅ Updated: ${filePath}`);
                console.log(`   Hash: ${hash}\n`);
                updatedCount++;
            } else {
                // Check if the file is referenced in HTML
                if (html.includes(filePath)) {
                    console.log(`ℹ️  No change: ${filePath}`);
                    console.log(`   Hash: ${hash}\n`);
                } else {
                    console.log(`⚠️  Not found in HTML: ${filePath}\n`);
                }
            }
        }
    }
    
    // Process CSS files
    console.log('🎨 Processing CSS files...\n');
    for (const filePath of config.cssFiles) {
        const hash = calculateSRI(filePath);
        
        if (hash) {
            const originalHTML = html;
            html = updateLinkSRIInHTML(html, filePath, hash);
            
            if (html !== originalHTML) {
                console.log(`✅ Updated: ${filePath}`);
                console.log(`   Hash: ${hash}\n`);
                updatedCount++;
            } else {
                // Check if the file is referenced in HTML
                if (html.includes(filePath)) {
                    console.log(`ℹ️  No change: ${filePath}`);
                    console.log(`   Hash: ${hash}\n`);
                } else {
                    console.log(`⚠️  Not found in HTML: ${filePath}\n`);
                }
            }
        }
    }
    
    // Write updated HTML
    if (updatedCount > 0) {
        fs.writeFileSync(config.htmlFile, html, 'utf8');
        console.log(`\n✨ Updated ${updatedCount} SRI hash(es) in index.html`);
    } else {
        console.log('\n✨ All SRI hashes are up to date');
    }
}

// Run
main();
