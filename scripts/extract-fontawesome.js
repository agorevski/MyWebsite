#!/usr/bin/env node
/**
 * Font Awesome Icon Extractor and Minifier
 * Scans HTML files for used Font Awesome icons and generates a minimal CSS file
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    htmlFiles: [path.join(__dirname, '..', 'index.html')],
    faSourceDir: path.join(__dirname, '..', 'node_modules', '@fortawesome', 'fontawesome-free'),
    outputCss: path.join(__dirname, '..', 'Content', 'stylesheets', 'vendors', 'font-awesome.min.css'),
    fontsOutputDir: path.join(__dirname, '..', 'Content', 'fonts')
};

/**
 * Extract all Font Awesome icon classes from HTML files
 * @returns {Set<string>} Set of icon names (without fa- prefix)
 */
function extractUsedIcons() {
    const icons = new Set();
    
    for (const htmlFile of config.htmlFiles) {
        const content = fs.readFileSync(htmlFile, 'utf8');
        
        // Match fa-* classes (Font Awesome 4 style: fa fa-icon)
        const fa4Regex = /\bfa\s+fa-([a-z0-9-]+)/gi;
        let match;
        while ((match = fa4Regex.exec(content)) !== null) {
            icons.add(match[1]);
        }
        
        // Match fa-solid, fa-regular, fa-brands style (Font Awesome 6)
        const fa6Regex = /\b(?:fa-solid|fa-regular|fa-brands|fas|far|fab)\s+fa-([a-z0-9-]+)/gi;
        while ((match = fa6Regex.exec(content)) !== null) {
            icons.add(match[1]);
        }
    }
    
    return icons;
}

/**
 * Parse Font Awesome 7 CSS to extract icon definitions
 * @param {string} cssContent - CSS file content
 * @returns {Map<string, string>} Map of icon name to CSS content code
 */
function parseIconDefinitions(cssContent) {
    const icons = new Map();
    
    // Font Awesome 7 uses --fa custom property: .fa-iconname { --fa: "\f007"; }
    const iconRegex = /\.fa-([a-z0-9-]+)\s*\{\s*--fa:\s*"([^"]+)";\s*\}/gi;
    let match;
    
    while ((match = iconRegex.exec(cssContent)) !== null) {
        icons.set(match[1], match[2]);
    }
    
    return icons;
}

/**
 * Generate minimal Font Awesome CSS
 * @param {Set<string>} usedIcons - Set of icon names to include
 * @param {Map<string, string>} allIcons - Map of all available icons
 * @returns {string} Minimal CSS content
 */
function generateMinimalCss(usedIcons, allIcons) {
    const fontPath = '../../fonts';
    
    // Base Font Awesome 7 styles with font-face
    let css = `/*!
 * Font Awesome Free 7.x (subset)
 * License - https://fontawesome.com/license/free
 */
@font-face {
  font-family: "Font Awesome 7 Free";
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url("${fontPath}/fa-solid-900.woff2") format("woff2");
}

@font-face {
  font-family: "Font Awesome 7 Brands";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("${fontPath}/fa-brands-400.woff2") format("woff2");
}

.fa, .fas, .fa-solid {
  --fa-family: "Font Awesome 7 Free";
  --fa-style: 900;
  font-family: var(--fa-family);
  font-weight: var(--fa-style);
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: inline-block;
  line-height: 1;
}

.fab, .fa-brands {
  --fa-family: "Font Awesome 7 Brands";
  --fa-style: 400;
  font-family: var(--fa-family);
  font-weight: var(--fa-style);
}

.fa::before, .fas::before, .fa-solid::before, .fab::before, .fa-brands::before {
  content: var(--fa);
}

`;

    // Brand icons list (these use the brands font)
    const brandIcons = new Set([
        'facebook', 'facebook-f', 'facebook-square', 'linkedin', 'linkedin-in', 
        'github', 'github-alt', 'github-square', 'twitter', 'instagram',
        'youtube', 'twitch', 'discord', 'windows', 'apple', 'android', 'linux',
        'google', 'amazon', 'microsoft', 'slack', 'spotify', 'tiktok', 'whatsapp',
        'telegram', 'reddit', 'pinterest', 'snapchat', 'dribbble', 'behance',
        'codepen', 'stack-overflow', 'npm', 'docker', 'python', 'js', 'node',
        'react', 'angular', 'vuejs', 'sass', 'css3', 'html5', 'bootstrap',
        'wordpress', 'paypal', 'stripe', 'bitcoin', 'ethereum', 'steam',
        'playstation', 'xbox', 'nintendo-switch', 'unity', 'unreal-engine'
    ]);

    // Add only used icon definitions
    const includedIcons = [];
    const missingIcons = [];
    
    for (const icon of usedIcons) {
        if (allIcons.has(icon)) {
            const content = allIcons.get(icon);
            // Brand icons need to use the brands font family
            if (brandIcons.has(icon)) {
                css += `.fa-${icon} { --fa: "${content}"; --fa-family: "Font Awesome 7 Brands"; --fa-style: 400; }\n`;
            } else {
                css += `.fa-${icon} { --fa: "${content}"; }\n`;
            }
            includedIcons.push(icon);
        } else {
            missingIcons.push(icon);
        }
    }

    return { css, includedIcons, missingIcons };
}

/**
 * Copy required font files
 */
function copyFontFiles() {
    const webfontsDir = path.join(config.faSourceDir, 'webfonts');
    const fontsToKeep = [
        'fa-solid-900.woff2',
        'fa-brands-400.woff2'
    ];

    if (!fs.existsSync(config.fontsOutputDir)) {
        fs.mkdirSync(config.fontsOutputDir, { recursive: true });
    }

    for (const fontFile of fontsToKeep) {
        const src = path.join(webfontsDir, fontFile);
        const dest = path.join(config.fontsOutputDir, fontFile);
        
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`  Copied: ${fontFile}`);
        } else {
            console.warn(`  Warning: Font file not found: ${fontFile}`);
        }
    }
}

/**
 * Main function
 */
function main() {
    console.log('🎨 Font Awesome Icon Extractor\n');

    // Check if Font Awesome is installed
    if (!fs.existsSync(config.faSourceDir)) {
        console.error('Error: @fortawesome/fontawesome-free not found.');
        console.error('Run: npm install @fortawesome/fontawesome-free');
        process.exit(1);
    }

    // Extract used icons from HTML
    console.log('📖 Scanning HTML files for used icons...');
    const usedIcons = extractUsedIcons();
    console.log(`   Found ${usedIcons.size} unique icons: ${[...usedIcons].join(', ')}\n`);

    // Parse Font Awesome CSS files
    console.log('📦 Parsing Font Awesome CSS...');
    const solidCssPath = path.join(config.faSourceDir, 'css', 'solid.css');
    const brandsCssPath = path.join(config.faSourceDir, 'css', 'brands.css');
    const allCssPath = path.join(config.faSourceDir, 'css', 'all.css');
    
    let allIcons = new Map();
    
    // Try to parse the all.css first as it has everything
    if (fs.existsSync(allCssPath)) {
        const cssContent = fs.readFileSync(allCssPath, 'utf8');
        allIcons = parseIconDefinitions(cssContent);
    } else {
        // Fall back to individual files
        if (fs.existsSync(solidCssPath)) {
            const solidCss = fs.readFileSync(solidCssPath, 'utf8');
            const solidIcons = parseIconDefinitions(solidCss);
            solidIcons.forEach((v, k) => allIcons.set(k, v));
        }
        if (fs.existsSync(brandsCssPath)) {
            const brandsCss = fs.readFileSync(brandsCssPath, 'utf8');
            const brandIcons = parseIconDefinitions(brandsCss);
            brandIcons.forEach((v, k) => allIcons.set(k, v));
        }
    }
    
    console.log(`   Parsed ${allIcons.size} icon definitions\n`);

    // Generate minimal CSS
    console.log('✂️  Generating minimal CSS...');
    const { css, includedIcons, missingIcons } = generateMinimalCss(usedIcons, allIcons);
    
    // Write output CSS
    fs.writeFileSync(config.outputCss, css);
    console.log(`   Output: ${config.outputCss}`);
    console.log(`   Included ${includedIcons.length} icons\n`);
    
    if (missingIcons.length > 0) {
        console.log(`⚠️  Missing icons (not found in Font Awesome 6): ${missingIcons.join(', ')}`);
        console.log('   These icons may have been renamed or removed.\n');
    }

    // Copy font files
    console.log('📁 Copying font files...');
    copyFontFiles();

    console.log('\n✨ Font Awesome build complete!');
    
    // Output size comparison hint
    const outputSize = fs.statSync(config.outputCss).size;
    console.log(`   CSS size: ${(outputSize / 1024).toFixed(2)} KB`);
}

// Run
main();
