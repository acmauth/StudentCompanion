import { nativeSettings } from "./nativeSettings";
import { StatusBar, Style } from '@capacitor/status-bar';
import CapacitorPersistedStore from "../storage/capacitorPersistedStore";
import { get } from "svelte/store";

export const darkMode = new CapacitorPersistedStore<boolean>(true, "darkMode");

// Check if dark mode is enabled and set it if it is
export async function checkAppMode() {
    let isDark = get(darkMode);
    if (isDark == null || isDark == undefined) { // Setting default dark mode | Fixes the toggle being ticked wrongly
        darkMode.set(true);
        isDark = true;
        document.body.classList.add('dark');
        await StatusBar.setStyle({ style: Style.Dark });
    }
    document.body.classList.toggle('dark', isDark);
	
}

// Toggle dark mode on or off
export async function toggleDarkTheme() {
    const isDark = document.body.classList.toggle('dark');
    darkMode.set(isDark);
    // nativeSettings();
    if (isDark) {
        await StatusBar.setStyle({ style: Style.Dark });
    } else {
        await StatusBar.setStyle({ style: Style.Light });
    }
}
