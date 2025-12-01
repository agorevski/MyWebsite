namespace Driftly.Models;

/// <summary>
/// Represents a category of sounds
/// </summary>
public class Category
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string IconName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
