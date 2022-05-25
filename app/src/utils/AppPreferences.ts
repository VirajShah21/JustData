type AppTheme = 'light' | 'dark';

class AppPreferences {
    private static _theme?: AppTheme;

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

    static set theme(theme: AppTheme) {
        localStorage.setItem('theme', theme);
        AppPreferences._theme = theme;
    }
}

export default AppPreferences;
export type { AppTheme };
