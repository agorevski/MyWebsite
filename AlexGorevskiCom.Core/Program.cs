using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using AlexGorevskiCom.Core.Data;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.StaticAssets;
using System.IO.Compression;

var builder = WebApplication.CreateBuilder(args);

// Enable static web assets for all environments
if (builder.Environment.IsProduction())
{
    builder.WebHost.UseStaticWebAssets();
}

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddRazorPages();

// Add response compression for better performance
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat([
        "text/css",
        "text/javascript",
        "application/javascript",
        "application/json",
        "text/json",
        "image/svg+xml"
    ]);
});

builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
    options.Level = CompressionLevel.Optimal;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


// Conditional HTTPS redirection with port detection
if (app.Configuration.GetValue<string>("Kestrel:Endpoints:Https:Url") != null)
{
    app.UseHttpsRedirection();
}

// Enable response compression
app.UseResponseCompression();

// Configure static files with caching for performance
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // Set cache headers for static assets
        const int durationInSeconds = 60 * 60 * 24 * 30; // 30 days
        ctx.Context.Response.Headers.Append("Cache-Control", $"public,max-age={durationInSeconds}");
        
        // Add ETag for better caching
        if (ctx.File.Exists)
        {
            var etag = $"\"{ctx.File.LastModified:yyyyMMddHHmmss}\"";
            ctx.Context.Response.Headers.Append("ETag", etag);
        }
    }
});

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();
