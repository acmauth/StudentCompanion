import Keycloak from './keycloak';
import { keyCloakStore } from "$stores/keycloak.store";
import { get } from 'svelte/store';
import { userTokens } from "$stores/credentials.store";
import { goto } from '$app/navigation';

const isProduction = process.env.NODE_ENV === 'production';

// Initialize Keycloak
export const keycloakSettings = {keycloakConfig: {
                            url: "https://oauth2.it.auth.gr/auth",
                            realm: "universis",
                            clientId: "aristomate"
                        },
                        scope: "students:read",
                        redirectUri: "https://applink.aristomate.gr/authsso/callback"};

                        
const keycloak = new Keycloak(keycloakSettings.keycloakConfig );

console.log(`${isProduction} CORE.TS`);

keycloak.init({redirectUri: keycloakSettings.redirectUri, scope:keycloakSettings.scope, pkceMethod: 'S256', adapter: !isProduction? 'default' : "capacitor-browser"})
.then(function(authenticated) {
    console.log(`[Keycloak] Authenticated: ${authenticated}`);
    if (authenticated && keycloak.tokenParsed) {
        console.log('User is authenticated | Core');
        // Display relevant information
        const token = keycloak.token;        
        updateStore(keycloak.token as string, keycloak.refreshToken as string);
        goto('/pages/homepage');

    } else {
        console.log('User is not authenticated');
    }
});

export default keycloak;

export function updateStore(token: string, refreshToken: string){
    keyCloakStore.update((keycloak) => {
        keycloak.token = token;
        keycloak.refreshToken = refreshToken;
        return keycloak;
    });
}