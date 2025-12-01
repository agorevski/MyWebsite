# Driftly - Relaxation & White Noise App

A .NET MAUI Android application for relaxation, focus, and sleep through ambient sound mixing.

## Overview

Driftly is a freemium mobile app that helps users relax, focus, or sleep by playing and mixing ambient sounds such as rain, ocean waves, wind, and white noise.

### Key Features

- **Multi-track Sound Mixer**: Play up to 3 sounds simultaneously (free users) or unlimited (premium)
- **Volume Control**: Individual volume sliders for each active sound
- **Timer Function**: Auto-stop playback after a set duration
- **Sound Categories**: Rain, Water, Nature, Indoor, and Noise categories
- **Favorites**: Save custom mixes for quick access (coming soon)
- **Premium Features**: Unlock all sounds, remove ads, unlimited mixing tracks
- **Freemium Model**: Ads after every 3 plays, in-app subscriptions available

## Architecture

### Technology Stack

- **Framework**: .NET MAUI (.NET 9)
- **Language**: C#
- **Target Platform**: Android (API 21+, Target SDK 34)
- **Database**: SQLite for local storage
- **Audio Engine**: Plugin.Maui.Audio
- **MVVM Framework**: CommunityToolkit.Mvvm

### Project Structure

```
Driftly/
├── Models/              # Data models (Sound, Mix, Category, etc.)
├── ViewModels/          # MVVM ViewModels with business logic
├── Views/               # XAML UI pages
├── Services/            # Business logic services
│   ├── AudioService.cs        # Multi-track audio playback
│   ├── DataStoreService.cs    # Sound metadata management
│   └── UserPreferencesService.cs  # Settings and premium status
├── Data/                # Database layer
│   └── DatabaseService.cs     # SQLite operations
├── Converters/          # Value converters for XAML bindings
├── Resources/           # Assets, images, audio files
│   └── Raw/
│       └── sounds_metadata.json  # Sound definitions
└── Platforms/           # Platform-specific code
    └── Android/
```

### Core Features Implemented

#### Phase 1: Core Audio & UI ✅
- [x] MAUI project setup
- [x] Sound playback with Plugin.Maui.Audio
- [x] Home page with sound categories
- [x] Mixer page with active sounds
- [x] Timer functionality
- [x] Volume controls

#### Phase 2: Data Layer ✅
- [x] SQLite database setup
- [x] Sound, Mix, and Category models
- [x] DataStoreService for sound metadata
- [x] UserPreferencesService for settings

#### Phase 3: Core Services ✅
- [x] AudioService with multi-track support
- [x] Looping and volume control
- [x] Free tier track limits (3 tracks)
- [x] Premium user detection

#### Phase 4: UI Polish ✅
- [x] Custom color palette (#8AB6D6, #C9E4CA, #FAFAFA, #2E3A59)
- [x] Rounded, minimalist design
- [x] Category and sound browsing
- [x] Responsive layouts

### Remaining Work

#### Phase 5: Monetization (Planned)
- [ ] Google AdMob SDK integration
- [ ] Interstitial ads (after every 3 plays)
- [ ] Rewarded video ads for temporary unlocks
- [ ] In-app billing for premium subscriptions
- [ ] Ad removal for premium users

#### Phase 6: Additional Features (Planned)
- [ ] Favorites page - save and load custom mixes
- [ ] Settings page - theme selection, notifications
- [ ] Crossfade transitions between sounds
- [ ] Background playback support
- [ ] Push notifications for reminders
- [ ] Lottie animations for visual ambiance

#### Phase 7: Assets & Content (Planned)
- [ ] 12 ambient sound .ogg files
- [ ] Custom app icon
- [ ] Splash screen
- [ ] Sound category icons
- [ ] Premium sound indicators

#### Phase 8: Testing & Deployment (Planned)
- [ ] Unit tests for services
- [ ] UI tests for critical flows
- [ ] Memory leak testing
- [ ] Beta testing via Play Console
- [ ] Google Play Store listing
- [ ] Firebase Analytics integration

## Requirements

- .NET 9 SDK or later
- .NET MAUI workload installed
- Android SDK 34
- Visual Studio 2022 or JetBrains Rider

## Getting Started

### 1. Install .NET MAUI Workload

```bash
dotnet workload install maui-android
```

### 2. Restore Dependencies

```bash
cd Driftly
dotnet restore
```

### 3. Build the Project

```bash
dotnet build
```

### 4. Run on Android Emulator

```bash
dotnet build -t:Run -f net9.0-android
```

## Sound Metadata

Sounds are defined in `Resources/Raw/sounds_metadata.json` with the following structure:

```json
{
  "id": "rain_soft",
  "name": "Soft Rain",
  "category": "Rain",
  "fileName": "rain_soft.ogg",
  "premium": false,
  "iconName": "cloud_rain",
  "description": "Gentle rain sounds for relaxation"
}
```

### Available Sound Categories

- **Rain**: Soft rain, heavy rain, thunderstorm
- **Water**: Ocean waves, river stream
- **Nature**: Gentle wind, forest birds
- **Indoor**: Fireplace, coffee shop
- **Noise**: White noise, pink noise, brown noise

## Dependencies

```xml
<PackageReference Include="Plugin.Maui.Audio" Version="3.0.1" />
<PackageReference Include="sqlite-net-pcl" Version="1.9.172" />
<PackageReference Include="SQLitePCLRaw.bundle_green" Version="2.1.10" />
<PackageReference Include="CommunityToolkit.Mvvm" Version="8.3.2" />
```

## Freemium Logic

```csharp
// Free users: 3 simultaneous tracks, ads every 3 plays
// Premium users: Unlimited tracks, no ads, all premium sounds

if (!user.IsPremium) {
    if (playCount % 3 == 0) ShowAd();
    if (activeTracks >= 3) ShowUpgradePrompt();
    if (sound.IsPremium) LockSound();
}
```

## Development Notes

### Audio Playback

- Sounds loop continuously until stopped
- Each sound has independent volume control (0.0 - 1.0)
- Audio streams are loaded from app package files
- Players are properly disposed to prevent memory leaks

### Database

SQLite database (`driftly.db3`) stores:
- Saved mixes with sound IDs and volumes
- User preferences (premium status, play count)

### User Preferences

Stored using MAUI Preferences API:
- `is_premium`: Boolean for premium status
- `play_count`: Integer for tracking ad frequency
- `app_theme`: String for theme selection

## License

Copyright © 2025 Alex Gorevski. All rights reserved.

---

**Status**: MVP in progress - Core functionality complete, monetization and polish pending
