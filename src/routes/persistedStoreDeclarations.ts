import { toggles } from "./pages/notifications/notificationToggles";
import { dismissedItems } from "$components/recentResults/dismissedItems";
import { EventStore } from "$components/calendar/event/EventStore";
import { qrStore } from "$components/wallet/qrStore";
import { userCreds, userTokens } from "$stores/credentials.store";
import { scheduledNotifications } from "$lib/calendarNotifications/notificationsStore";
import { keyCloakStore } from "$stores/keycloak.store";
import type CapacitorPersistedStore from "$lib/storage/capacitorPersistedStore";
import { userCredsFlag } from "$components/webmailLogin/userCredsFlagStore";

const persistedStores: CapacitorPersistedStore<any>[] = [
    toggles,
    userCreds,
    dismissedItems,
    scheduledNotifications,
    EventStore,
    qrStore,
    userTokens,
    userCredsFlag,
    keyCloakStore
    // Add new stores here
];

export async function loadPersistedStores() {
    console.log('Loading persisted stores');
    persistedStores.forEach(async (store) => await store.loadFromStorage());
}