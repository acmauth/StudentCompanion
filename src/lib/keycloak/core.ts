import Keycloak from 'keycloak-js';
import type { KeycloakInitOptions, KeycloakConfig } from 'keycloak-js';
import { keyCloakStore } from "$stores/keycloak.store";
import { get } from 'svelte/store';
import { userTokens } from "$stores/credentials.store";
import { goto } from '$app/navigation';
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Keycloak
const keycloakSettings = {keycloakConfig: {
                            url: "https://oauth2.it.auth.gr/auth",
                            realm: "universis",
                            clientId: "aristomate"
                        },
                        scope: "students:read",
                        redirectUri: "https://applink.aristomate.gr/authsso/callback"};

                        
const keycloak = new Keycloak(keycloakSettings.keycloakConfig as KeycloakConfig);

keycloak.init({
            redirectUri: keycloakSettings.redirectUri,
            scope:keycloakSettings.scope,
            pkceMethod: 'S256',
            token: get(keyCloakStore).token,
            refreshToken: get(keyCloakStore).refreshToken,
            idToken: get(keyCloakStore).idToken,
            adapter: isProduction? 'cordova-native' : 'default'}
).then(function(authenticated) {
    console.log(authenticated);
    if (authenticated && keycloak.tokenParsed) {
        console.log('User is authenticated');
        // Display relevant information
        const token = keycloak.token;
        console.log(token);
        console.log(keycloak);
        userTokens.update((newTokens) => {
            newTokens.universis.token = token as string; // Type assertion added here
            return newTokens;
        });
        
        keyCloakStore.update((keycloak) => {
            keycloak.token = token as string;
            keycloak.refreshToken = keycloak.refreshToken;
            keycloak.idToken = keycloak.idToken;
            return keycloak;
        });

        goto('pages/homepage');

    } else {
        console.log('User is not authenticated');
    }
});

export default keycloak;