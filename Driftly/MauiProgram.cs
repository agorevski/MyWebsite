using Microsoft.Extensions.Logging;
using Plugin.Maui.Audio;
using Driftly.Data;
using Driftly.Services;
using Driftly.ViewModels;
using Driftly.Views;

namespace Driftly;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
				fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
			});

#if DEBUG
		builder.Logging.AddDebug();
#endif

		// Register Audio Manager
		builder.Services.AddSingleton(AudioManager.Current);

		// Register Services
		builder.Services.AddSingleton<DataStoreService>();
		builder.Services.AddSingleton<AudioService>();
		builder.Services.AddSingleton<UserPreferencesService>();
		
		// Register Database
		var dbPath = Path.Combine(FileSystem.AppDataDirectory, "driftly.db3");
		builder.Services.AddSingleton(s => new DatabaseService(dbPath));

		// Register ViewModels
		builder.Services.AddTransient<HomeViewModel>();
		builder.Services.AddTransient<MixerViewModel>();

		// Register Views
		builder.Services.AddTransient<HomePage>();
		builder.Services.AddTransient<MixerPage>();

		return builder.Build();
	}
}

