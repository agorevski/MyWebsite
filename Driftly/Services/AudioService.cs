using Plugin.Maui.Audio;
using Driftly.Models;

namespace Driftly.Services;

/// <summary>
/// Service for managing audio playback with multi-track support
/// </summary>
public class AudioService
{
    private readonly IAudioManager _audioManager;
    private readonly Dictionary<string, IAudioPlayer> _activePlayers = new();
    private const int MaxFreeTracks = 3;

    public AudioService(IAudioManager audioManager)
    {
        _audioManager = audioManager;
    }

    public bool IsPremiumUser { get; set; } = false;

    public int MaxTracks => IsPremiumUser ? 10 : MaxFreeTracks;

    public int ActiveTracksCount => _activePlayers.Count;

    public bool CanAddTrack => ActiveTracksCount < MaxTracks;

    public async Task<bool> PlaySoundAsync(Sound sound, double volume = 0.5)
    {
        if (!CanAddTrack && !_activePlayers.ContainsKey(sound.Id))
        {
            return false;
        }

        try
        {
            // Stop existing player if already playing
            if (_activePlayers.TryGetValue(sound.Id, out var existingPlayer))
            {
                existingPlayer.Stop();
                existingPlayer.Dispose();
                _activePlayers.Remove(sound.Id);
            }

            // Create new player
            var audioStream = await FileSystem.OpenAppPackageFileAsync(sound.FileName);
            var player = _audioManager.CreatePlayer(audioStream);
            
            player.Volume = volume;
            player.Loop = true;
            player.Play();

            _activePlayers[sound.Id] = player;
            return true;
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error playing sound {sound.Id}: {ex.Message}");
            return false;
        }
    }

    public void StopSound(string soundId)
    {
        if (_activePlayers.TryGetValue(soundId, out var player))
        {
            player.Stop();
            player.Dispose();
            _activePlayers.Remove(soundId);
        }
    }

    public void StopAllSounds()
    {
        foreach (var player in _activePlayers.Values)
        {
            player.Stop();
            player.Dispose();
        }
        _activePlayers.Clear();
    }

    public void SetVolume(string soundId, double volume)
    {
        if (_activePlayers.TryGetValue(soundId, out var player))
        {
            player.Volume = Math.Clamp(volume, 0.0, 1.0);
        }
    }

    public bool IsPlaying(string soundId)
    {
        return _activePlayers.ContainsKey(soundId) && _activePlayers[soundId].IsPlaying;
    }

    public List<string> GetActivesoundIds()
    {
        return _activePlayers.Keys.ToList();
    }

    public void Dispose()
    {
        StopAllSounds();
    }
}
