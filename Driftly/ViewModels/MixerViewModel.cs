using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Driftly.Models;
using Driftly.Services;

namespace Driftly.ViewModels;

/// <summary>
/// ViewModel for the mixer page where users play and mix sounds
/// </summary>
public partial class MixerViewModel : BaseViewModel
{
    private readonly AudioService _audioService;
    private readonly DataStoreService _dataStore;
    private readonly UserPreferencesService _preferences;

    [ObservableProperty]
    private ObservableCollection<PlayingSound> playingSounds = new();

    [ObservableProperty]
    private ObservableCollection<Sound> availableSounds = new();

    [ObservableProperty]
    private int timerMinutes = 30;

    [ObservableProperty]
    private bool isTimerActive = false;

    private System.Timers.Timer? _timer;

    public MixerViewModel(AudioService audioService, DataStoreService dataStore, UserPreferencesService preferences)
    {
        _audioService = audioService;
        _dataStore = dataStore;
        _preferences = preferences;
        Title = "Sound Mixer";
    }

    [RelayCommand]
    private async Task LoadSoundsAsync()
    {
        if (IsBusy)
            return;

        try
        {
            IsBusy = true;
            var sounds = await _dataStore.GetSoundsAsync();
            
            AvailableSounds.Clear();
            foreach (var sound in sounds)
            {
                AvailableSounds.Add(sound);
            }
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task AddSoundAsync(Sound sound)
    {
        if (sound.IsPremium && !_preferences.IsPremium)
        {
            await Shell.Current.DisplayAlert("Premium Sound", 
                "This sound requires a premium subscription.", "OK");
            return;
        }

        if (!_audioService.CanAddTrack)
        {
            await Shell.Current.DisplayAlert("Track Limit Reached", 
                $"Free users can play up to {_audioService.MaxTracks} sounds. Upgrade to premium for unlimited tracks!", 
                "OK");
            return;
        }

        var success = await _audioService.PlaySoundAsync(sound);
        if (success)
        {
            var playingSound = new PlayingSound
            {
                Sound = sound,
                Volume = 0.5,
                IsPlaying = true
            };
            PlayingSounds.Add(playingSound);
            _preferences.IncrementPlayCount();
        }
    }

    [RelayCommand]
    private void RemoveSound(PlayingSound playingSound)
    {
        _audioService.StopSound(playingSound.Sound.Id);
        PlayingSounds.Remove(playingSound);
    }

    [RelayCommand]
    private void VolumeChanged(PlayingSound playingSound)
    {
        _audioService.SetVolume(playingSound.Sound.Id, playingSound.Volume);
    }

    [RelayCommand]
    private void StartTimer()
    {
        if (_timer != null)
            return;

        IsTimerActive = true;
        _timer = new System.Timers.Timer(TimerMinutes * 60 * 1000);
        _timer.Elapsed += (s, e) =>
        {
            StopAll();
            IsTimerActive = false;
        };
        _timer.Start();
    }

    [RelayCommand]
    private void StopTimer()
    {
        _timer?.Stop();
        _timer?.Dispose();
        _timer = null;
        IsTimerActive = false;
    }

    [RelayCommand]
    private void StopAll()
    {
        _audioService.StopAllSounds();
        PlayingSounds.Clear();
        StopTimer();
    }

    public void Cleanup()
    {
        StopAll();
    }
}
