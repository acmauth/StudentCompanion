import { nativeSettings } from "./nativeSettings";

// Check if dark mode is enabled and set it if it is
export async function checkAppMode() {
    let darkMode = localStorage.getItem('darkMode');
    if (darkMode === null) { // Setting default dark mode | Fixes the toggle being ticked wrongly
        localStorage.setItem('darkMode', 'true');
        darkMode = "true";
    }
    const isDark = darkMode === "true";
    document.body.classList.toggle('dark', isDark);
	
}

// Toggle dark mode on or off
export function toggleDarkTheme() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', isDark.toString());
    nativeSettings();
}
