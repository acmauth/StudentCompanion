import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';
import { jwtDecode } from "jwt-decode";
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { toastController } from 'ionic-svelte';


// Store for the user's credentials
export const keyCloakStore = new CapacitorPersistedStore({
    token: "",
    refreshToken: "",
}, 'keycloakStore')

export function getValidity(){
    const token = get(keyCloakStore).token;
    if(token){
        const decodedToken = jwtDecode(token);
        const now = Date.now() / 1000;
        return (decodedToken.exp as number) > now;
    }
    return false;
}

export function getRefreshEligibility(){
    const token = get(keyCloakStore).refreshToken;
    if(token){
        const decodedToken = jwtDecode(token);
        const now = Date.now() / 1000;
        return (decodedToken.exp as number) > now;
    }
    return false;
}

export function getTokenLife(){
    const token = get(keyCloakStore).token;
    if(token){
        const decodedToken = jwtDecode(token);
        const now = Date.now() / 1000;
        return (decodedToken.exp as number) - now;
    }
    return 0;
}

export function getRefreshLife(){
    const token = get(keyCloakStore).refreshToken;
    if(token){
        const decodedToken = jwtDecode(token);
        const now = Date.now() / 1000;
        return (decodedToken.exp as number) - now;
    }
    return 0;
}

export function getRefreshToken(){
    return get(keyCloakStore).refreshToken;
}

export function getToken(){
    return get(keyCloakStore).token;
}

export function updateStore(token: string, refreshToken: string){
    keyCloakStore.update((keycloak) => {
        keycloak.token = token;
        keycloak.refreshToken = refreshToken;
        return keycloak;
    });
}

export function clearStore(){
    keyCloakStore.set({token: "", refreshToken: ""});
}

export async function refreshToken(): Promise<Boolean>{
    const refresh = getRefreshToken();
    const valid = getRefreshEligibility();
    if(refresh && valid){
        const url = `https://oauth2.it.auth.gr/auth/realms/universis/protocol/openid-connect/token`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=refresh_token&refresh_token=${refresh}&client_id=aristomate`
        });
        if(response.ok){
            const data = await response.json();
            updateStore(data.access_token, data.refresh_token);
            return true;
        }
    }
    return false;
}

export function logout(){
    clearStore();
    const showToast = async () => {
        const toast = await toastController.create({
           color: 'danger',
           duration: 4000,
           message: 'Η σύνδεσή σου έληξε. Θα χρειαστεί να συνδεθείς ξανά.',
        });
     
        toast.present();
     };
    showToast();
    goto('/login');
}