# Development Guide

This guide covers setting up and working with the portfolio website locally.

## Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- A modern web browser

## Quick Start

```bash
# Clone the repository
git clone https://github.com/agorevski/MyWebsite.git
cd MyWebsite

# Install dependencies
npm install

# Start development server
npm run serve
```

Visit `http://localhost:8080` in your browser.

## Available Commands

### Build Commands

| Command | Description |
| ------- | ----------- |
| `npm run build` | Full build: CSS, JS, and SRI hashes |
| `npm run build:css` | Build CSS only (purge, prefix, minify) |
| `npm run build:js` | Bundle and minify JavaScript |
| `npm run update:sri` | Regenerate SRI hashes in index.html |
| `npm run watch` | Watch mode for development |
| `npm run clean` | Remove the dist folder |

### Code Quality

| Command | Description |
| ------- | ----------- |
| `npm run lint` | Run all linters (CSS + JS) |
| `npm run lint:css` | Lint CSS files with Stylelint |
| `npm run lint:js` | Lint JavaScript with ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run lint:css:fix` | Auto-fix CSS lint issues |
| `npm run lint:js:fix` | Auto-fix JS lint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without changes |

### Development

| Command | Description |
| ------- | ----------- |
| `npm run serve` | Start local HTTP server on port 8080 |
| `npm run watch` | Watch for file changes and rebuild |
| `npm run optimize:images` | Optimize images with imagemin |

## Development Workflow

### 1. Start Watch Mode

```bash
npm run watch
```

This runs two parallel watchers:

- **CSS watcher**: Rebuilds on `Content/stylesheets/**/*.css` changes
- **JS watcher**: Rebuilds on `Content/javascript/custom.js` changes

### 2. Make Changes

Edit files in the `Content/` directory:

- **CSS**: `Content/stylesheets/*.css`
- **JavaScript**: `Content/javascript/custom.js`
- **HTML**: `index.html`

### 3. Check Output

Built files are output to `dist/`:

- `dist/stylesheets/` - Compiled CSS
- `dist/javascript/` - Bundled JavaScript

### 4. Lint Before Commit

```bash
npm run lint
npm run format:check
```

## File Structure for Development

```text
Content/
├── stylesheets/
│   ├── critical.min.css      # Combined critical CSS (variables, accessibility, fonts)
│   ├── async-noncritical.min.css # Main styles
│   └── vendors/              # Third-party CSS
│       └── bootstrap5.min.css
│
└── javascript/
    ├── custom.js             # Main application logic (source)
    ├── custom.modern.js      # ES6+ version
    └── vendors/              # Third-party libraries
        ├── jquery-3.7.1.min.js
        ├── bootstrap5.bundle.min.js
        ├── materialize.min.js
        └── scrollreveal.min.js
```

## CSS Development

### Adding New Styles

1. Edit the appropriate CSS file in `Content/stylesheets/`
2. Run `npm run build:css` or use `npm run watch`
3. PurgeCSS will automatically remove unused styles

### CSS Custom Properties

Use CSS variables defined in `critical.min.css` for consistency:

```css
.my-component {
    color: var(--primary-color);
    background: var(--bg-color);
    box-shadow: var(--card-shadow);
    transition: var(--transition-fast);
}
```

### Dark Mode Support

Add dark mode variants:

```css
/* Light mode (default) */
.my-component {
    background: #fff;
}

/* Dark mode via system preference */
@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) .my-component {
        background: #1a1a2e;
    }
}

/* Dark mode via manual toggle */
[data-theme="dark"] .my-component {
    background: #1a1a2e;
}
```

### PurgeCSS Safelisting

If your CSS is being incorrectly removed by PurgeCSS, add it to the safelist in `postcss.config.js`:

```javascript
safelist: {
    standard: ['my-class', 'another-class'],
    deep: [/my-pattern/],
    greedy: [/dynamic/]
}
```

## JavaScript Development

### Module Pattern

The codebase uses an IIFE pattern with jQuery:

```javascript
(function($) {
    "use strict";
    
    function myFeature() {
        // Your code here
    }
    
    $(document).on('ready', function() {
        myFeature();
    });
})(jQuery);
```

### Adding New Features

1. Add your function to `Content/javascript/custom.js`
2. Call it in the `document.ready` handler
3. Run `npm run build:js` to bundle
4. Run `npm run update:sri` to update integrity hashes

### Build Output

esbuild bundles and minifies `custom.js` to:

```text
dist/javascript/custom.min.js
```

## SRI (Subresource Integrity)

All JavaScript files use SRI hashes for security.

### Automatic Update

After modifying JavaScript files:

```bash
npm run update:sri
```

This runs `scripts/update-sri.js` which:

1. Calculates SHA-384 hashes for all JS files
2. Updates `integrity` attributes in `index.html`

### Manual Hash Generation (PowerShell)

```powershell
$bytes = [System.IO.File]::ReadAllBytes("path/to/file.js")
$sha384 = [System.Security.Cryptography.SHA384]::Create()
$hashBytes = $sha384.ComputeHash($bytes)
$b64 = [Convert]::ToBase64String($hashBytes)
Write-Output "sha384-$b64"
```

## Linting Configuration

### ESLint (JavaScript)

Configuration: `.eslintrc.json`

```bash
npm run lint:js      # Check issues
npm run lint:js:fix  # Auto-fix
```

### Stylelint (CSS)

Configuration: `.stylelintrc.json`

```bash
npm run lint:css      # Check issues
npm run lint:css:fix  # Auto-fix
```

### Prettier (Formatting)

Configuration: `.prettierrc`

```bash
npm run format        # Format files
npm run format:check  # Check only
```

## Adding Images

1. Add images to the `Images/` directory
2. Create WebP versions for modern browsers
3. Create multiple sizes for responsive loading
4. Use the `<picture>` element:

```html
<picture>
    <source srcset="image-small.webp 400w,
                    image-medium.webp 800w,
                    image.webp 1200w"
            sizes="(min-width: 1200px) 400px, 350px"
            type="image/webp">
    <img src="image-small.png" 
         alt="Descriptive alt text"
         loading="lazy"
         width="400" 
         height="400">
</picture>
```

## Troubleshooting

### Port 8080 Already in Use

```bash
# Use a different port
npx http-server . -p 3000 -o
```

### PurgeCSS Removing Needed Styles

Add classes to the safelist in `postcss.config.js`:

```javascript
safelist: {
    standard: ['my-dynamic-class']
}
```

### Build Errors

```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

### SRI Hash Mismatch

If you see console errors about SRI hash mismatch:

```bash
npm run update:sri
```

This regenerates all hashes based on current file contents.
