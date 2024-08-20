<script lang="ts">
import Keycloak from 'keycloak-js';
import { onMount } from 'svelte';
import {page} from '$app/stores';
import type { KeycloakInitOptions, KeycloakConfig } from 'keycloak-js';

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
                var token = keycloak.token;

                // Display the token, username, and email on the page
                var tokenElement = document.createElement('p');
                tokenElement.textContent = 'Token: ' + token;
                document.body.appendChild(tokenElement);

                // Add logout button
                var logoutButton = document.createElement('button');
                logoutButton.textContent = 'Logout';
                logoutButton.addEventListener('click', function() {
                    keycloak.logout();
                });
                document.body.appendChild(logoutButton);
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
</ion-content>
