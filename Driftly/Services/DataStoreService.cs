using System.Text.Json;
using Driftly.Models;

namespace Driftly.Services;

/// <summary>
/// Service for loading and managing sound data
/// </summary>
public class DataStoreService
{
    private List<Sound>? _sounds;
    private List<Category>? _categories;

    public async Task<List<Sound>> GetSoundsAsync()
    {
        if (_sounds != null)
            return _sounds;

        try
        {
            using var stream = await FileSystem.OpenAppPackageFileAsync("sounds_metadata.json");
            using var reader = new StreamReader(stream);
            var json = await reader.ReadToEndAsync();
            _sounds = JsonSerializer.Deserialize<List<Sound>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new List<Sound>();

            return _sounds;
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error loading sounds: {ex.Message}");
            return new List<Sound>();
        }
    }

    public async Task<List<Category>> GetCategoriesAsync()
    {
        if (_categories != null)
            return _categories;

        var sounds = await GetSoundsAsync();
        _categories = sounds
            .Select(s => s.Category)
            .Distinct()
            .Select(c => new Category
            {
                Id = c.ToLower().Replace(" ", "_"),
                Name = c,
                IconName = GetCategoryIcon(c),
                Description = $"{c} sounds"
            })
            .ToList();

        return _categories;
    }

    public async Task<List<Sound>> GetSoundsByCategoryAsync(string category)
    {
        var sounds = await GetSoundsAsync();
        return sounds.Where(s => s.Category.Equals(category, StringComparison.OrdinalIgnoreCase)).ToList();
    }

    public async Task<Sound?> GetSoundByIdAsync(string id)
    {
        var sounds = await GetSoundsAsync();
        return sounds.FirstOrDefault(s => s.Id == id);
    }

    private static string GetCategoryIcon(string category)
    {
        return category.ToLower() switch
        {
            "rain" => "cloud_rain",
            "water" => "water",
            "nature" => "tree",
            "indoor" => "home",
            "noise" => "volume_up",
            _ => "music_note"
        };
    }
}
