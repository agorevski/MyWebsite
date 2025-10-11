using CommunityToolkit.Mvvm.ComponentModel;

namespace Driftly.ViewModels;

/// <summary>
/// Base view model with common functionality
/// </summary>
public partial class BaseViewModel : ObservableObject
{
    [ObservableProperty]
    private bool isBusy;

    [ObservableProperty]
    private string title = string.Empty;
}
