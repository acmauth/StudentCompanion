import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

/**
 * Store webmail credentials for iOS background fetch tasks
 * iOS background tasks cannot access Svelte stores, so we need to persist credentials
 */
export async function storeWebmailCredentialsForBackground(
    username: string,
    password: string
): Promise<void> {
    if (Capacitor.getPlatform() !== "ios") {
        return; // Only needed for iOS
    }

    try {
        await Preferences.set({
            key: "webmail_username",
            value: username,
        });
        await Preferences.set({
            key: "webmail_password",
            value: password,
        });
        console.log("Webmail credentials stored for iOS background fetch");
    } catch (error) {
        console.error("Failed to store webmail credentials:", error);
    }
}

/**
 * Clear stored webmail credentials (call this on logout)
 */
export async function clearWebmailCredentials(): Promise<void> {
    if (Capacitor.getPlatform() !== "ios") {
        return;
    }

    try {
        await Preferences.remove({ key: "webmail_username" });
        await Preferences.remove({ key: "webmail_password" });
        console.log("Webmail credentials cleared");
    } catch (error) {
        console.error("Failed to clear webmail credentials:", error);
    }
}

/**
 * Schedule iOS background fetch (call this when app becomes active)
 */
export async function scheduleIOSBackgroundFetch(): Promise<void> {
    if (Capacitor.getPlatform() !== "ios") {
        return;
    }

    try {
        const BackgroundTaskHandler = (window as any).BackgroundTaskHandler;
        if (BackgroundTaskHandler?.shared) {
            BackgroundTaskHandler.shared.scheduleBackgroundFetch();
            console.log("iOS background fetch scheduled");
        }
    } catch (error) {
        console.error("Failed to schedule iOS background fetch:", error);
    }
}
