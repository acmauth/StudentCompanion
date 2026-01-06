import { nativeSettings } from "./nativeSettings";
import { StatusBar, Style } from '@capacitor/status-bar';

// Check if dark mode is enabled and set it if it is
export async function checkAppMode() {
    let darkMode = localStorage.getItem('darkMode');
    console.log("Dark mode from localStorage:", darkMode);
    if (darkMode === null) { // Setting default dark mode | Fixes the toggle being ticked wrongly
        localStorage.setItem('darkMode', 'true');
        darkMode = "true";
        document.body.classList.add('dark');
        await StatusBar.setStyle({ style: Style.Dark });
    }
    const isDark = darkMode === "true";
    document.body.classList.toggle('dark', isDark);
	
}

// Toggle dark mode on or off
export async function toggleDarkTheme() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', isDark.toString());
    // nativeSettings();
    if (isDark) {
        await StatusBar.setStyle({ style: Style.Dark });
    } else {
        await StatusBar.setStyle({ style: Style.Light });
    }
}
