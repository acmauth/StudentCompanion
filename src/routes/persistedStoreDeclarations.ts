import { toggles } from "./pages/notifications/notificationToggles";
import { elearningCredentials } from "$lib/elearningAuthentication/elearningCredentials.store";
import { elearningCredentials as elearningCredentialsNew } from "$lib/-elearning/stores/elearningCredentials.store";
import { userCreds } from "$lib/-universis/stores/universisCredentialsStore";
import { dismissedItems } from "$components/recentResults/dismissedItems";
import { classStore } from "$components/schedule/class/classStore";
import { taskStore } from "$components/schedule/task/taskStore";
import { qrStore } from "$components/wallet/qrStore";
import { userCreds as credsUserCreds, userTokens } from "$stores/credentials.store";
import type CapacitorPersistedStore from "$lib/storage/capacitorPersistedStore";

const persistedStores: CapacitorPersistedStore<any>[] = [
    toggles,
    elearningCredentials,
    userCreds,
    elearningCredentialsNew,
    dismissedItems,
    classStore,
    taskStore,
    qrStore,
    credsUserCreds,
    userTokens,
    // Add new stores here
];

export async function loadPersistedStores() {
    console.log('Loading persisted stores');
    persistedStores.forEach(async (store) => await store.loadFromStorage());
}