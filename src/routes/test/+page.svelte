<script lang="ts">
import Keycloak from 'keycloak-js';
import { onMount } from 'svelte';
import {page} from '$app/stores';
import type { KeycloakInitOptions, KeycloakConfig } from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'https://oauth2.it.auth.gr/auth',
    realm: 'universis',
    clientId: 'aristomate'
});

let authenticated = false;
import { get } from 'svelte/store';

// Get the URL search parameters
const urlParams = new URLSearchParams($page.url.search);

// Extract the state and code from the search parameters
const state = urlParams.get('state');
const code = urlParams.get('code');


console.log($page.url.search);
console.log(state);
console.log(code);
console.log($page);

onMount(async () => {
    try {
        authenticated = await keycloak.init({redirectUri: "https://applink.aristomate.gr/authsso/callback", scope:"students:read", pkceMethod: 'S256'});
        console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
        if (!authenticated) {
            // Use the state and code to get a token
            if (state && code) {
                try {
                    const tokenResponse = await keycloak.token({
                        grantType: 'authorization_code',
                        code: code,
                        redirectUri: "https://applink.aristomate.gr/authsso/callback",
                    });

                    // Access the token from the token response
                    const token = tokenResponse.access_token;

                    // Use the token as needed
                    console.log('Token:', token);
                } catch (error) {
                    console.error('Failed to get token:', error);
                }
            }
        }
    } catch (error) {
        console.error('Failed to initialize adapter:', error);
    }
});
</script>

<ion-content>
    <p>Test page</p>
    {#if authenticated}
        <p>User is authenticated</p>
    {:else}
        <p>User is not authenticated</p>
        <ion-button on:click={() => keycloak.login()} aria-hidden>Login</ion-button>
    {/if}
</ion-content>
