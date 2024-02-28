import { writable } from 'svelte/store';

// Define the initial state of the store
const initialState = {
    count: 0,
};

// Create a writable store
export const tries = writable(initialState);

// Define the increment method
export const increment = () => {
    tries.update((state) => {
        return { ...state, count: state.count + 1 };
    });
};

// Define the reset method
export const reset = () => {
    tries.set(initialState);
};