using Driftly.Models;
using Driftly.ViewModels;

namespace Driftly.Views;

public partial class MixerPage : ContentPage
{
    private readonly MixerViewModel _viewModel;

    public MixerPage(MixerViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        BindingContext = _viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _viewModel.LoadSoundsCommand.ExecuteAsync(null);
    }

    protected override void OnDisappearing()
    {
        base.OnDisappearing();
        _viewModel.Cleanup();
    }

    private void OnVolumeChanged(object sender, ValueChangedEventArgs e)
    {
        if (sender is Slider slider && slider.BindingContext is PlayingSound playingSound)
        {
            _viewModel.VolumeChangedCommand.Execute(playingSound);
        }
    }
}
