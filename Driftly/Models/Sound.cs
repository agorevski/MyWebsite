namespace Driftly.Models;

/// <summary>
/// Represents an individual ambient sound that can be played
/// </summary>
public class Sound
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public bool IsPremium { get; set; }
    public string IconName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
