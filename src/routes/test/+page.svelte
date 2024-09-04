<script lang="ts">
import Keycloak from 'keycloak-js';
import { userTokens } from "$stores/credentials.store";
import type { KeycloakInitOptions, KeycloakConfig } from 'keycloak-js';
import { goto } from '$app/navigation';

// Initialize Keycloak
const keycloak = new Keycloak({
            url: 'https://oauth2.it.auth.gr/auth',
            realm: 'universis',
            clientId: 'aristomate'
});

// Get the token when the user logs in
keycloak.init({redirectUri: "https://applink.aristomate.gr/authsso/callback", scope:"students:read", pkceMethod: 'S256'}).then(function(authenticated) {
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

                goto('pages/homepage');

            } else {
                console.log('User is not authenticated');
            }
        });

let authenticated = false;

</script>

<ion-content>
    <p>Test page</p>
    {#if authenticated}
        <p>User is authenticated</p>
    {:else}
        <p>User is not authenticated</p>
        <ion-button on:click={() => keycloak.login({scope:"students:read"})} aria-hidden>Login</ion-button>
    {/if}
    <ion-button on:click={()=>{goto("pages/personalInfo")}} aria-hidden>Go to personal info</ion-button>
</ion-content>
