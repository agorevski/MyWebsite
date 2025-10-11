using SQLite;

namespace Driftly.Models;

/// <summary>
/// Represents a saved mix of sounds with their volumes
/// </summary>
[Table("Mixes")]
public class Mix
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    /// <summary>
    /// Comma-separated list of sound IDs
    /// </summary>
    public string SoundIds { get; set; } = string.Empty;
    
    /// <summary>
    /// Comma-separated list of volume values (0.0 to 1.0)
    /// </summary>
    public string Volumes { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
