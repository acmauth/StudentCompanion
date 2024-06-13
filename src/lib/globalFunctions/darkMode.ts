import { nativeSettings } from "./nativeSettings";

// Check if dark mode is enabled and set it if it is
export function checkAppMode() {
    const darkMode = localStorage.getItem('darkMode');
    const isDark = darkMode === "true";
    document.body.classList.toggle('dark', isDark);
	
}

// Toggle dark mode on or off
export function toggleDarkTheme() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', isDark.toString());
    nativeSettings();
}
