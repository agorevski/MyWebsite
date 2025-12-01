namespace Driftly.Services;

/// <summary>
/// Service for managing user preferences and premium status
/// </summary>
public class UserPreferencesService
{
    private const string PremiumKey = "is_premium";
    private const string PlayCountKey = "play_count";
    private const string ThemeKey = "app_theme";

    public bool IsPremium
    {
        get => Preferences.Get(PremiumKey, false);
        set => Preferences.Set(PremiumKey, value);
    }

    public int PlayCount
    {
        get => Preferences.Get(PlayCountKey, 0);
        set => Preferences.Set(PlayCountKey, value);
    }

    public void IncrementPlayCount()
    {
        PlayCount++;
    }

    public bool ShouldShowAd()
    {
        // Show ad every 3 plays for free users
        return !IsPremium && PlayCount % 3 == 0 && PlayCount > 0;
    }

    public string AppTheme
    {
        get => Preferences.Get(ThemeKey, "light");
        set => Preferences.Set(ThemeKey, value);
    }

    public void ClearAllPreferences()
    {
        Preferences.Clear();
    }
}
