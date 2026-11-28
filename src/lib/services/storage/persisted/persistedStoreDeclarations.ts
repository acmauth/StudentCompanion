import type CapacitorPersistedStore from "./CapacitorPersistedStore";
import { toggles } from "$components/homepage/notifications/notificationToggles";
import { dismissedItems } from "$components/homepage/recents/dismissedItems";
import { EventStore } from "$components/calendar/event/eventStore";
import { qrStore } from "$components/homepage/wallet/qrStore";
import { userCreds, userTokens } from "$services/authentication/credentialsStore";
import { scheduledNotifications } from "$services/notifications/calendar/notificationsStore";
import { loginStore } from "$services/authentication/loginStore";
import { webmailLoggedIn } from "$services/webmail/userCredsFlagStore";
import { darkMode } from "$methods/app/darkMode";
import { avatarStore } from "$methods/avatar/avatarStore";
import { customCourses } from "$components/grades/degreeCalculator/customCourses";

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
    customCourses,
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