<script lang="ts">
    import { page } from "$app/stores";
    // import Keycloak from 'keycloak-capacitor';
    import Keycloak from "keycloak-js";
    import {goto} from "$app/navigation";
    import {updateStore, keycloakSettings} from "../core";
	import { onMount } from "svelte";
	import { get } from "imapflow/lib/imap-commands";
	import { keyCloakStore } from "$stores/keycloak.store";
    const isProduction = process.env.NODE_ENV === 'production';

    const keycloak = new Keycloak(keycloakSettings.keycloakConfig);

    keycloak.init({
            redirectUri: keycloakSettings.redirectUri,
            scope:keycloakSettings.scope,
            pkceMethod: 'S256',
            adapter: 'default'}
    ).then(function(authenticated) {
        console.log(authenticated);
        console.log("HERERERERER AUTHENTICATE");
        if (authenticated && keycloak.tokenParsed && keycloak.token && keycloak.refreshToken) {
            console.log('User is authenticated');
            // Display relevant information
            const token = keycloak.token;
            const refreshToken = keycloak.refreshToken;
            
            updateStore(token, refreshToken);

            goto('/pages/homepage');

        } else {
            console.log('User is not authenticated');
        }
    });

    onMount(async () => {
        if (!isProduction) {
            console.log("Token exists");
            goto('/pages/homepage');
        }
    })

</script>

<ion-content fullscreen>
    <div class="ion-padding ion-text-center" style="display:flex; flex-direction:column; gap:1rem;">
        <ion-title>Καλώς ήρθες στο Aristomate!</ion-title>
    </div>
    <ion-progress-bar type="indeterminate" color="primary"></ion-progress-bar>
    <ion-progress-bar type="indeterminate" color="secondary"></ion-progress-bar>
    <ion-progress-bar type="indeterminate" color="tertiary"></ion-progress-bar>
    <ion-progress-bar type="indeterminate" color="success"></ion-progress-bar>
    <ion-progress-bar type="indeterminate" color="warning"></ion-progress-bar>
    <ion-progress-bar type="indeterminate" color="danger"></ion-progress-bar>
    <ion-progress-bar type="indeterminate" color="light"></ion-progress-bar>
    <ion-progress-bar type="indeterminate" color="medium"></ion-progress-bar>
    <ion-progress-bar type="indeterminate" color="dark"></ion-progress-bar>


</ion-content>
<ion-footer>
    <div class="ion-padding ion-text-center" style="display:flex; flex-direction:column; gap:1rem;">
        <ion-button>Πίσω στο login</ion-button>
    </div>
</ion-footer>