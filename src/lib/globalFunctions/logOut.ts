import { Preferences } from "@capacitor/preferences";
import Dexie from "dexie";
import { Browser } from '@capacitor/browser'; 
import { resetPersistedStores } from "$src/routes/persistedStoreDeclarations.js";
import { goto } from "$app/navigation";

// Do we wanna log out? Let's clear our path
export async function invalidateAuth(){
    let x = "https://oauth2.it.auth.gr/auth/realms/universis/protocol/openid-connect/logout" //?id_token_hint=" + get(loginStore).id_token;
    await resetPersistedStores();
    localStorage.clear();
    Preferences.clear();
    Dexie.delete('cachedData');
    await Browser.open({ url: x });
}

// Log out function - exported for use in other components
export async function logOut() {
    await invalidateAuth();
    console.log("[src/lib/globalFunctions/logOut.ts] Navigating to login");
    await goto('/login');
}