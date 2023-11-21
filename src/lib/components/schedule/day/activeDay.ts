import { writable } from 'svelte/store';

type DayCodes = {
    [key: number]: string;
};

export const dayCodes: DayCodes = {
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat",
    0: "sun"
};

export const activeDay = writable(dayCodes[new Date().getDay()]);

export function getToday() {
    return dayCodes[new Date().getDay()];
}
