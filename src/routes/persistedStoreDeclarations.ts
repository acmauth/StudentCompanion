import type CapacitorPersistedStore from "$lib/storage/capacitorPersistedStore";
import { jwtDecode } from "jwt-decode";
import { get } from "svelte/store";
import { toggles } from "./notifications/notificationToggles";
import { dismissedItems } from "$components/recents/dismissedItems";
import { EventStore } from "$components/calendar/event/EventStore";
import { qrStore } from "$components/wallet/qrStore";
import { userCreds, userTokens } from "$stores/credentials.store";
import { scheduledNotifications } from "$lib/calendarNotifications/notificationsStore";
import { loginStore } from "$src/lib/authentication/loginStore";
import { webmailLoggedIn } from "$components/webmailLogin/userCredsFlagStore";
import { darkMode } from "$src/lib/globalFunctions/darkMode";
import { avatarStore } from "$stores/avatar.store";

const persistedStores: CapacitorPersistedStore<any>[] = [
    darkMode,
    toggles,
    userCreds,
    dismissedItems,
    scheduledNotifications,
    EventStore,
    qrStore,
    userTokens,
    webmailLoggedIn,
    loginStore,
    avatarStore,
    // Add new stores here
];

/**
 * The user id that scopes per-user storage, taken from the "sub" claim of the
 * Keycloak token persisted in loginStore. Empty when nobody is logged in, which
 * keeps the plain (unnamespaced) keys for the pre-login stores and for the
 * startup of an existing install.
 * @returns The user id, or "" when the session has no usable token.
 */
export function currentUserScope(): string {
    try {
        const { access_token, id_token } = get(loginStore);
        const token = access_token || id_token;
        if (!token) {
            return "";
        }
        const claims = jwtDecode<Record<string, string>>(token);
        return claims.sub ?? "";
    } catch {
        return "";
    }
}

export async function loadPersistedStores() {
    console.log('Loading persisted stores');
    const scope = currentUserScope();
    persistedStores.forEach(store => store.setScope(scope));
    await Promise.all(persistedStores.map(store => store.loadFromStorage()));
}

export async function resetPersistedStores() {
    console.log('Resetting persisted stores');
    await Promise.all(persistedStores.map(store => store.reset()));
}
