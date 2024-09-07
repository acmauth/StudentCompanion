<script lang="ts">
    // Client for PKCE keycloak oauth2 openid connect flow
    import { onMount } from 'svelte';
    import {page} from '$app/stores';
    import * as wellknown from './wellknown.json';

    const URL = "https://oauth2.it.auth.gr/auth/realms/universis/protocol/openid-connect/";
    const client = "aristomate";
    const redirectUri = "https://applink.aristomate.gr/authsso/callback";
    const scope = "students:read";
    const pkceMethod = "S256";

    console.log(wellknown);

    let authenticated = false;

    onMount(async () => {
        // Check if user is already authenticated
        const token = localStorage.getItem('token');
        if (token) {
            authenticated = true;
        } else {
            // User is not authenticated, show login button
            authenticated = false;
            // Handle callback from login page
            const code = new URLSearchParams(window.location.search).get('code');
            if (code) {
                const code = new URLSearchParams(window.location.search).get('code');
                const session = new URLSearchParams(window.location.search).get('session');
                if (code) {
                    // Exchange code for token
                    const response = await fetch(`/test?code=${code}&session_state=${session}&client_id=${client}&redirect_uri=${redirectUri}&code_verifier=${localStorage.getItem("pkce_verifier")}`, {method: 'GET'});
                    const data = await response.json();
                    const token = data.token;
                    console.log(data);
                    if (token) {
                        // Store token in local storage
                        localStorage.setItem('token', token);
                        authenticated = true;
                    }
                }
            }
        }
    });

    // const {randomBytes, createHash} = require("node:crypto");
    import {randomBytes, createHash} from "crypto";

    function generatePKCEPair() {
        const NUM_OF_BYTES = 22; // Total of 44 characters (1 Bytes = 2 char) (standard states that: 43 chars <= verifier <= 128 chars)
        const HASH_ALG = "sha256";
        const randomVerifier = randomBytes(NUM_OF_BYTES).toString('hex')
        const hash = createHash(HASH_ALG).update(randomVerifier).digest('base64');
        const challenge = hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // Clean base64 to make it URL safe
        return {verifier: randomVerifier, challenge}
    }
    const handleLogin = () => {
        // Redirect user to login page
        const {verifier, challenge} = generatePKCEPair();
        localStorage.setItem('pkce_verifier', verifier);
        window.location.href = `${URL}auth?client_id=${client}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&code_challenge_method=${pkceMethod}&code_challenge=${challenge}`;
    };

    
    

</script>

<ion-content>
    <p>Test page</p>
    {#if authenticated}
        <p>User is authenticated</p>
    {:else}
        <p>User is not authenticated</p>
        <ion-button on:click={handleLogin} aria-hidden>Login</ion-button>
    {/if}
</ion-content>
