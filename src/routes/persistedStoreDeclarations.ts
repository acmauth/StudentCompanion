import { toggles } from "./pages/notifications/notificationToggles";

const persistedStores = [toggles];

export async function loadPersistedStores() {
    console.log('Loading persisted stores');
    persistedStores.forEach(async (store) => await store.loadFromStorage());
}