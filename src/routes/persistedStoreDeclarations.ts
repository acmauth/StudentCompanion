import type CapacitorPersistedStore from "$lib/storage/capacitorPersistedStore";
import { toggles } from "./notifications/notificationToggles";
import { dismissedItems } from "$components/recentResults/dismissedItems";
import { EventStore } from "$components/calendar/event/EventStore";
import { qrStore } from "$components/wallet/qrStore";
import { userCreds, userTokens } from "$stores/credentials.store";
import { scheduledNotifications } from "$lib/calendarNotifications/notificationsStore";
import { loginStore } from "$src/lib/authentication/loginStore";
import { webmailLoggedIn } from "$components/webmailLogin/userCredsFlagStore";
import { darkMode } from "$src/lib/globalFunctions/darkMode";
import { achievementStore } from "$src/lib/globalFunctions/achievements";
import { avatarStore } from "$src/routes/test/avatarStore"

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
    avatarStore
    // Add new stores here
];

export async function loadPersistedStores() {
    console.log('Loading persisted stores');
    await Promise.all(persistedStores.map(store => store.loadFromStorage()));
}

export async function resetPersistedStores() {
    console.log('Resetting persisted stores');
    await Promise.all(persistedStores.map(store => store.reset()));
}