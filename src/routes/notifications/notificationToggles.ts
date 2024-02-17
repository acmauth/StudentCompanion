import { writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';

function createToggles() {
    const { subscribe, set, update } = persisted("NotificationToggles", {
        all: true,
        universis: true,
        elearning: true,
        elSystem: true
    });

    const toggleUniversis = () => update((n) => {
        n.universis = !n.universis;
        n.all = n.universis && n.elearning && n.elSystem;
        return n;
    });

    const toggleElearning = () => update((n) => {
        n.elearning = !n.elearning;
        n.all = n.universis && n.elearning && n.elSystem;
        return n;
    });

    const toggleelSystem = () => update((n) => {
        n.elSystem = !n.elSystem;
        n.all = n.universis && n.elearning && n.elSystem;
        return n;
    });

    const toggleAll = () => update((n) => {
        if (n.all) {
            return n;
        }
        n.all = !n.all;
        n.universis = n.all;
        n.elearning = n.all;
        n.elSystem = n.all;
        return n;
    });

    return {
        subscribe,
        toggleUniversis,
        toggleElearning,
        toggleelSystem,
        toggleAll,
    };
}

export const toggles = createToggles();

