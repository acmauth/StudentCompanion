import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';
import { jwtDecode } from "jwt-decode";
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { toastController } from 'ionic-svelte';

export type LoginTokens = {
    access_token: string;
    id_token: string;
    refresh_token: string;
    expires_at: string;
};

export type LoginStoreItem = keyof LoginTokens;

// Store for the user's login tokens

export const loginStore = new CapacitorPersistedStore<LoginTokens>({
    access_token: "",
    id_token: "",
    refresh_token: "",
    expires_at: ""
}, 'loginStore'
);
