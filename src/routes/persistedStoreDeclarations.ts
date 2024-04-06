import { toggles } from "./pages/notifications/notificationToggles";
import { dismissedItems } from "$components/recentResults/dismissedItems";
import { classStore } from "$components/schedule/class/classStore";
import { taskStore } from "$components/schedule/task/taskStore";
import { qrStore } from "$components/wallet/qrStore";
import { userCreds, userTokens } from "$stores/credentials.store";
import type CapacitorPersistedStore from "$lib/storage/capacitorPersistedStore";

const persistedStores: CapacitorPersistedStore<any>[] = [
    toggles,
    userCreds,
    dismissedItems,
    classStore,
    taskStore,
    qrStore,
    userTokens,
    // Add new stores here
];

export async function loadPersistedStores() {
    console.log('Loading persisted stores');
    persistedStores.forEach(async (store) => await store.loadFromStorage());
}