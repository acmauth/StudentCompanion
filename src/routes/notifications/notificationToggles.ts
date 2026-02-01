import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';

export const toggles = new CapacitorPersistedStore({
    all: true,
    universis: true,
    elearning: true,
    webmail: true
}, "NotificationToggles");

export function toggleUniversis() {
    toggles.update((n) => {
        n.universis = true;
        n.all = false;
        n.elearning = false;
        n.webmail = false;

        return n;
    });
}

export function toggleElearning() {
    toggles.update((n) => {
        n.universis = false;
        n.all = false;
        n.elearning = true;
        n.webmail = false;

        return n;
    });

}

export function toggleWebmail() {
  toggles.update((n) => {
        n.webmail = true;
        n.elearning = false;
        n.universis = false;
        n.all = false;
  
        return n;
    });
}

export function toggleAll() {
    toggles.update((n) => {
        n.universis = true;
        n.all = true;
        n.elearning = true;
        n.webmail = true;

        return n;
    });
}


