import { nativeSettings } from "./nativeSettings";
import { StatusBar, Style } from '@capacitor/status-bar';
import CapacitorPersistedStore from "../storage/capacitorPersistedStore";
import { get } from "svelte/store";

export const darkMode = new CapacitorPersistedStore<boolean>(false, "darkMode");
export const autoDarkMode = new CapacitorPersistedStore<boolean>(true, "autoDarkMode");


// Check if dark mode is enabled and set it if it is
export async function checkAppMode() {
	let isAuto = get(autoDarkMode);
    let isDark = get(darkMode);
    if (isAuto) {
        isDark = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
        darkMode.set(isDark);
    } else if (isDark == null || isDark == undefined) {        darkMode.set(false);
        isDark = false;
    }
    document.body.classList.toggle('dark', isDark);
	if (isDark) {
        await StatusBar.setStyle({ style: Style.Dark });
    } else {
        await StatusBar.setStyle({ style: Style.Light });
    }
	
}

// Toggle dark mode on or off
export async function toggleDarkTheme() {
    const isDark = document.body.classList.toggle('dark');
    darkMode.set(isDark);
    if (isDark) {
        await StatusBar.setStyle({ style: Style.Dark });
    } else {
        await StatusBar.setStyle({ style: Style.Light });
    }
}

export async function toggleAutoDarkMode() {
    let isAuto = !get(autoDarkMode);
    autoDarkMode.set(isAuto);
    if (isAuto) {
        checkAppMode();
    }
}
if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async (e) => {
        if (get(autoDarkMode)) {
            darkMode.set(e.matches);
            checkAppMode();
        }
    });
}
