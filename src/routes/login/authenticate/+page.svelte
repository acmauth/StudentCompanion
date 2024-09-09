<script lang="ts">
    import { page } from "$app/stores";
    // import Keycloak from 'keycloak-capacitor';
    import Keycloak from "keycloak-js";
    import {goto} from "$app/navigation";
    import { updateStore, keycloakSettings } from "../core";
	import { onMount } from "svelte";
	import { get } from "imapflow/lib/imap-commands";
	import { keyCloakStore } from "$stores/keycloak.store";
    import { loadingController } from 'ionic-svelte';
    import HomepageSkeleton from "$components/homepage/homepageSkeleton.svelte";
    // Misc
    const isProduction = process.env.NODE_ENV === 'production';
    const keycloak = new Keycloak(keycloakSettings.keycloakConfig);
    let loading: any;
    const showLoading = async () => {
        const options = {
            message: 'Πραγματοποιείται σύνδεση',
            duration: -1,
            spinner: "lines",
            backdropdismiss: false,
            keyboardClose: false
        };
        loading = await loadingController.create(options);
        loading.present();
    };

    // Authenticate user, update token and redirect to homepage
    async function doAuthenticate(authenticated: Promise<Boolean>){
        showLoading();
        const authStatus = await authenticated;
        if (authStatus && keycloak.tokenParsed && keycloak.token && keycloak.refreshToken) {
            console.log('User is authenticated | login/authenticate');
            // Display relevant information
            const token = keycloak.token;
            const refreshToken = keycloak.refreshToken;
            
            updateStore(token, refreshToken);

            goto('/login/guide');

        } else {
            console.log('User is not authenticated | login/authenticate');
        }
        loading.dismiss();
        return authStatus;
    }

    // Initialize keycloak, create a promise for when the user is authenticated
    let authenticated = keycloak.init({
            redirectUri: keycloakSettings.redirectUri,
            scope:keycloakSettings.scope,
            pkceMethod: 'S256',
            adapter: 'default'}
    )
    
    // DEV: Redirect to homepage if token exists | Bypass login
    onMount(async () => {
        // if (!isProduction) {
        //     console.log("Token exists");
        //     goto('/login/guide');
        // }
    })

</script>

<ion-content fullscreen>
    {#await doAuthenticate(authenticated)}
        <HomepageSkeleton/>
    {:then authenticated}
        <div class="ion-padding ion-text-center" style="display:flex; flex-direction:column; gap:1rem;">
            <p>Χμμ, κανονικά θα έπρεπε να είχε δουλέψει αυτό. Δεν το ξαναδοκιμάζουμε μια;</p>
            <ion-button>Πίσω στο login</ion-button>
        </div>
    {:catch error}
        <div class="ion-padding ion-text-center" style="display:flex; flex-direction:column; gap:1rem;">
            <p>Κάτι να πήγε στραβά</p>
            <ion-button>Πίσω στο login</ion-button>
            <p>{error.message}</p>
        </div>
    {/await}


</ion-content>