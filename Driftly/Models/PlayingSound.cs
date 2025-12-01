namespace Driftly.Models;

/// <summary>
/// Represents a sound that is currently playing with its volume
/// </summary>
public class PlayingSound
{
    public Sound Sound { get; set; } = null!;
    public double Volume { get; set; } = 0.5;
    public bool IsPlaying { get; set; }
}
