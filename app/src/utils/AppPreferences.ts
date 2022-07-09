type AppTheme = 'light' | 'dark';

/**
 * A manager for the overall application's preferences.
 */
class AppPreferences {
    private static _theme?: AppTheme;

    /**
     * The applications active theme. This can either be 'light' or 'dark' for light an dark
     * mode respectively.
     */
    static get theme(): AppTheme {
        if (AppPreferences._theme) {
            return AppPreferences._theme;
        }

        const theme = localStorage.getItem('theme');
        if (theme) {
            AppPreferences._theme = theme as AppTheme;
        } else {
            AppPreferences._theme = 'dark';
        }

        return AppPreferences._theme;
    }

    /**
     * Assigns the application theme to either light or dark mode. To enable light mode
     * it should be assigned to 'light' or 'dark' for dark mode.
     */
    static set theme(theme: AppTheme) {
        localStorage.setItem('theme', theme);
        AppPreferences._theme = theme;
        const body = document.querySelector('body');
        if (body) {
            body.dataset.theme = theme;
        }
    }
}

export default AppPreferences;
export type { AppTheme };
