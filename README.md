# MyWebsite

Personal portfolio and projects by Alex Gorevski

## Projects

This repository contains two main projects:

### 1. AlexGorevskiCom.Core - Personal Website
**Website**: [www.alexgorevski.com](https://www.alexgorevski.com)

A modern personal portfolio website built with ASP.NET Core 9.0, showcasing professional experience, skills, and projects.

**Key Features:**
- Professional portfolio and resume
- Project showcase
- Contact form
- Responsive design
- SEO optimized

**Technology Stack:**
- ASP.NET Core 9.0
- Razor Pages
- SQLite with Entity Framework Core
- Bootstrap & Materialize CSS

📖 [View full documentation](./AlexGorevskiCom.Core/README.md)

### 2. Driftly - Relaxation & White Noise App
**Status**: MVP Development Complete ✅

A .NET MAUI mobile application for Android that helps users relax, focus, or sleep through ambient sound mixing.

**Key Features:**
- Multi-track sound mixing (3 simultaneous sounds for free users)
- 12 ambient sounds across 5 categories (Rain, Water, Nature, Indoor, Noise)
- Individual volume controls per sound
- Timer functionality for auto-stop
- Freemium monetization model
- SQLite database for saved mixes
- Clean, minimalist UI design

**Technology Stack:**
- .NET MAUI 9.0
- Android API 21+ (Target SDK 34)
- Plugin.Maui.Audio for playback
- SQLite for local storage
- MVVM pattern with CommunityToolkit

📖 [View full documentation](./Driftly/README.md)

## Getting Started

### Prerequisites

- .NET 9.0 SDK or later
- For Driftly: .NET MAUI workload (`dotnet workload install maui-android`)
- Visual Studio 2022, VS Code, or JetBrains Rider

### Quick Start

#### Build Everything
```bash
dotnet restore
dotnet build
```

#### Run Personal Website
```bash
cd AlexGorevskiCom.Core
dotnet run
```

#### Build Driftly for Android
```bash
cd Driftly
dotnet build -f net9.0-android
```

## Solution Structure

```
MyWebsite/
├── AlexGorevskiCom.Core/          # Personal website (ASP.NET Core)
│   ├── Pages/                     # Razor Pages
│   ├── wwwroot/                   # Static assets
│   ├── Data/                      # Database context
│   └── README.md
├── Driftly/                       # Mobile app (.NET MAUI)
│   ├── Models/                    # Data models
│   ├── ViewModels/                # MVVM ViewModels
│   ├── Views/                     # XAML pages
│   ├── Services/                  # Business logic
│   ├── Data/                      # SQLite database
│   └── README.md
└── MyWebsite.sln                  # Solution file

```

## Development Roadmap

### AlexGorevskiCom.Core
- ✅ .NET 9 migration complete
- ✅ Modern Razor Pages architecture
- ✅ SQLite database with EF Core
- ✅ Responsive design
- 🔄 External authentication providers (planned)
- 🔄 Contact form server-side processing (planned)

### Driftly
- ✅ Core audio engine with multi-track playback
- ✅ UI pages (Home, Mixer) with MVVM
- ✅ SQLite database for mixes
- ✅ Freemium logic foundation
- 🔄 Google AdMob integration (planned)
- 🔄 In-app purchases for premium (planned)
- 🔄 Favorites page for saved mixes (planned)
- 🔄 Settings page (planned)
- 🔄 Audio assets (12 .ogg files) (planned)
- 🔄 Google Play Store release (planned)

## License

Copyright © 2025 Alex Gorevski. All rights reserved.

## Contact

- Website: [www.alexgorevski.com](https://www.alexgorevski.com)
- GitHub: [@agorevski](https://github.com/agorevski)

