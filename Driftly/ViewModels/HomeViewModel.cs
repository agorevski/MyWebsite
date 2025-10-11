using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Driftly.Models;
using Driftly.Services;

namespace Driftly.ViewModels;

/// <summary>
/// ViewModel for the home page showing sound categories
/// </summary>
public partial class HomeViewModel : BaseViewModel
{
    private readonly DataStoreService _dataStore;
    private readonly AudioService _audioService;

    [ObservableProperty]
    private ObservableCollection<Category> categories = new();

    [ObservableProperty]
    private ObservableCollection<Sound> sounds = new();

    [ObservableProperty]
    private string selectedCategory = "All";

    public HomeViewModel(DataStoreService dataStore, AudioService audioService)
    {
        _dataStore = dataStore;
        _audioService = audioService;
        Title = "Driftly";
    }

    [RelayCommand]
    private async Task LoadDataAsync()
    {
        if (IsBusy)
            return;

        try
        {
            IsBusy = true;

            var categoriesList = await _dataStore.GetCategoriesAsync();
            Categories.Clear();
            foreach (var category in categoriesList)
            {
                Categories.Add(category);
            }

            await LoadSoundsAsync();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error loading data: {ex.Message}");
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task SelectCategoryAsync(string category)
    {
        SelectedCategory = category;
        await LoadSoundsAsync();
    }

    private async Task LoadSoundsAsync()
    {
        List<Sound> soundsList;

        if (SelectedCategory == "All")
        {
            soundsList = await _dataStore.GetSoundsAsync();
        }
        else
        {
            soundsList = await _dataStore.GetSoundsByCategoryAsync(SelectedCategory);
        }

        Sounds.Clear();
        foreach (var sound in soundsList)
        {
            Sounds.Add(sound);
        }
    }

    [RelayCommand]
    private async Task NavigateToMixerAsync()
    {
        await Shell.Current.GoToAsync("//MixerPage");
    }
}
