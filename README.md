# Alex Gorevski - Personal Portfolio Website

A modern static website showcasing my professional experience, education, and portfolio as a Senior Software Developer.

## 🌐 Live Site

Visit the site at: [www.alexgorevski.com](https://www.alexgorevski.com)

## 📋 About

This is a personal portfolio website built with pure HTML, CSS, and JavaScript. It features:

- Responsive design for all devices
- Interactive timeline of professional experience
- Educational background
- Personal interests and client showcase
- Contact form with Google Maps integration

## 🚀 Deployment

This site is deployed to Azure Static Web Apps via GitHub Actions.

## 📁 Project Structure

```text
.
├── index.html              # Main HTML file
├── favicon.ico             # Site favicon
├── Content/                # Static assets
│   ├── stylesheets/       # CSS files
│   ├── javascript/        # JavaScript files
│   ├── fonts/             # Font files
│   ├── docs/              # Resume PDF
│   └── toggle/            # Toggle components
├── Images/                 # Image assets
│   ├── profile/           # Profile images
│   ├── icons/             # Icon images
│   ├── logos/             # Company logos
│   └── timeline/          # Timeline images
└── .github/
    └── workflows/         # CI/CD workflows
```

## 🛠️ Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/agorevski/MyWebsite.git
   cd MyWebsite
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run serve
   ```

4. Visit `http://localhost:8080` in your browser

### Build Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build CSS & JS (minify, autoprefix) |
| `npm run build:css` | Build CSS only |
| `npm run build:js` | Build JavaScript only |
| `npm run watch` | Watch mode for development |
| `npm run lint` | Lint CSS & JavaScript |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run optimize:images` | Optimize images |
| `npm run clean` | Remove dist folder |
| `npm run serve` | Start local dev server |

### Development Workflow

1. Run `npm run watch` to start watching for file changes
2. Make changes to CSS/JS files in the `Content/` directory
3. Built files are output to `dist/`
4. Run `npm run lint` before committing to check for issues

## 📝 Technologies Used

- HTML5
- CSS3
- JavaScript (ES5+)
- Bootstrap 3
- Materialize CSS
- Font Awesome Icons
- jQuery
- Google Maps API
- Swiper.js

## 🔒 Security Configuration

This site uses Azure Static Web Apps security headers configured in `staticwebapp.config.json`.

### Security Headers Included

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME type sniffing |
| `X-Frame-Options` | `DENY` | Prevents clickjacking attacks |
| `X-XSS-Protection` | `1; mode=block` | Enables XSS filtering |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer information |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Disables unused browser features |
| `Content-Security-Policy` | See config file | Restricts resource loading sources |

### Subresource Integrity (SRI)

All JavaScript files include SRI hashes (`integrity` attributes) to ensure files haven't been tampered with.

### Updating Security Configuration

To modify security headers in Azure Static Web Apps:

1. Edit `staticwebapp.config.json` in the repository root
2. Modify the `globalHeaders` section to add/change headers
3. Commit and push changes - Azure will automatically apply the new configuration
4. Test headers using browser DevTools (Network tab → Response Headers) or tools like [securityheaders.com](https://securityheaders.com)

### Regenerating SRI Hashes

If you update any JavaScript files, regenerate their SRI hashes:

```powershell
# PowerShell command to generate SHA-384 hash
$bytes = [System.IO.File]::ReadAllBytes("path/to/file.js")
$sha384 = [System.Security.Cryptography.SHA384]::Create()
$hashBytes = $sha384.ComputeHash($bytes)
$b64 = [Convert]::ToBase64String($hashBytes)
Write-Output "sha384-$b64"
```

Or use an online tool like [srihash.org](https://www.srihash.org/).

Update the `integrity` attribute in `index.html` for the corresponding `<script>` tag.

## 📄 License

© Alex Gorevski 2017-2025. All rights reserved.
