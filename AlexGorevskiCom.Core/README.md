# Alex Gorevski Personal Website - .NET 9 Migration

This project has been successfully migrated from ASP.NET Web Pages (.NET Framework 4.6.1) to ASP.NET Core 9.0 with Razor Pages.

## Migration Summary

### What was migrated:
- ✅ **Project Structure**: Converted from Website project to ASP.NET Core 9.0 with Razor Pages
- ✅ **Static Content**: All images, CSS, JavaScript, and fonts migrated to wwwroot
- ✅ **Layout**: Converted `_SiteLayout.cshtml` to modern ASP.NET Core layout
- ✅ **Main Page**: Converted `Default.cshtml` to Razor Page format (`Pages/Index.cshtml`)
- ✅ **Authentication**: Modern ASP.NET Core Identity included (ready for configuration)
- ✅ **Database**: SQLite database configured (replaces SQL Server Compact)

### Key Changes:
- **Framework**: Upgraded from .NET Framework 4.6.1 to .NET 9.0
- **Project Type**: Website → ASP.NET Core Web Application
- **Pages**: Web Pages → Razor Pages
- **Database**: SQL Server Compact → SQLite with Entity Framework Core
- **Authentication**: WebSecurity → ASP.NET Core Identity
- **Dependency Management**: packages.config → PackageReferences in .csproj

### Modern Features Added:
- **Cross-platform**: Can now run on Windows, macOS, and Linux
- **Performance**: Significant performance improvements with .NET 9
- **Security**: Modern authentication and security features
- **Scalability**: Better suited for cloud deployment
- **Maintainability**: Modern development practices and tooling

## Requirements

- .NET 9.0 SDK or later
- Any modern IDE (Visual Studio 2022, Visual Studio Code, JetBrains Rider)

## Getting Started

### 1. Clone and Navigate
```bash
cd AlexGorevskiCom.Core
```

### 2. Restore Dependencies
```bash
dotnet restore
```

### 3. Build the Project
```bash
dotnet build
```

### 4. Run the Application
```bash
dotnet run
```

The application will be available at: `http://localhost:5269` (or the port shown in the console)

### 5. Development with Hot Reload
```bash
dotnet watch run
```

## Project Structure

```
AlexGorevskiCom.Core/
├── Pages/
│   ├── Shared/
│   │   └── _Layout.cshtml          # Main layout template
│   ├── Index.cshtml                # Home page content
│   ├── Index.cshtml.cs             # Page model for home page
│   ├── Privacy.cshtml              # Privacy page (generated)
│   └── Error.cshtml                # Error page
├── wwwroot/
│   ├── css/original/               # Migrated CSS files
│   ├── js/original/                # Migrated JavaScript files
│   ├── images/                     # All images from original site
│   ├── fonts/                      # Font files
│   └── favicon.ico                 # Site icon
├── Data/
│   ├── ApplicationDbContext.cs     # Database context
│   └── Migrations/                 # Entity Framework migrations
└── Areas/Identity/                 # Authentication pages
```

## Database Configuration

The new application uses SQLite instead of SQL Server Compact. The database file (`app.db`) will be created automatically in the project root when the application first runs.

To configure the database connection, modify the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "DataSource=app.db;Cache=Shared"
  }
}
```

## Authentication

ASP.NET Core Identity is preconfigured and ready to use. The authentication pages are located in `Areas/Identity/Pages/` and can be customized as needed.

## Deployment

### Local IIS (Windows)
```bash
dotnet publish -c Release
```

### Cloud Deployment
The application is now ready for deployment to:
- Azure App Service
- AWS Elastic Beanstalk
- Google Cloud Run
- Docker containers
- Any hosting provider supporting .NET 9

### Docker Support
To add Docker support, create a `Dockerfile`:
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["AlexGorevskiCom.Core.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AlexGorevskiCom.Core.dll"]
```

## Original vs New Comparison

| Feature | Original (.NET Framework) | New (.NET 9) |
|---------|---------------------------|---------------|
| Framework | .NET Framework 4.6.1 | .NET 9.0 |
| Project Type | Website | Web Application |
| Pages | Web Pages | Razor Pages |
| Database | SQL Server Compact | SQLite + EF Core |
| Authentication | WebSecurity | ASP.NET Core Identity |
| Platform | Windows only | Cross-platform |
| Performance | Good | Excellent |
| Package Management | packages.config | PackageReference |
| Deployment | IIS only | Multiple options |

## Next Steps

1. **Configure Authentication** - Set up external providers (Facebook, Google, etc.)
2. **Database Migration** - Import existing user data if needed
3. **Contact Form** - Implement server-side contact form processing
4. **SEO Optimization** - Add meta tags and structured data
5. **Performance** - Add caching and compression
6. **Testing** - Add unit and integration tests

## Troubleshooting

### Common Issues:

**Port already in use**: Change the port in `Properties/launchSettings.json`

**Missing static files**: Ensure files are in `wwwroot` directory

**Database errors**: Delete `app.db` to recreate the database

### Getting Help:
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [.NET 9 Release Notes](https://github.com/dotnet/core/tree/main/release-notes/9.0)
- [Migration Guide](https://docs.microsoft.com/en-us/aspnet/core/migration/)

---

**Migration completed successfully!** 🎉

The website has been modernized and is now running on the latest .NET 9 technology stack with improved performance, security, and maintainability.
