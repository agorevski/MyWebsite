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

To run locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/agorevski/MyWebsite.git
   cd MyWebsite
   ```

2. Open `index.html` in your browser, or use a local web server:

   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server
   ```

3. Visit `http://localhost:8000` in your browser

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

## 📄 License

© Alex Gorevski 2017-2025. All rights reserved.
