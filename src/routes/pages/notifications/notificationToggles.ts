import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';

export const toggles = new CapacitorPersistedStore({
    all: true,
    universis: true,
    elearning: true,
    elSystem: true,
    webmail: true
}, "NotificationToggles");

export function toggleUniversis() {
    toggles.update((n) => {
        n.universis = !n.universis;
        n.all = n.universis && n.elearning && n.elSystem && n.webmail;
        return n;
    });
}

export function toggleElearning() {
    toggles.update((n) => {
        n.elearning = !n.elearning;
        n.all = n.universis && n.elearning && n.elSystem && n.webmail;
        return n;
    });

}

export function toggleWebmail() {
  toggles.update((n) => {
        n.webmail = !n.webmail;
        n.all = n.universis && n.elearning && n.elSystem && n.webmail;
        return n;
    });
}

export function toggleelSystem() {
    toggles.update((n) => {
        n.elSystem = !n.elSystem;
        n.all = n.universis && n.elearning && n.elSystem && n.webmail;
        return n;
    });
}

export function toggleAll() {
    toggles.update((n) => {
        if (n.all) {
            return n;
        }
        n.all = !n.all;
        n.universis = n.all;
        n.elearning = n.all;
        n.elSystem = n.all;
        n.webmail = n.all;
        return n;
    });
}


