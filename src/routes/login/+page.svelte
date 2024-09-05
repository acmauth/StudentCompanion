<script lang='ts'>
    import { goto } from '$app/navigation';
	import { userTokens } from "$stores/credentials.store";
    import { getUniversisToken, getElearningToken} from "$lib/components/loginService/helpers"
    import Vector from "$lib/components/loginService/Vector.svg"
    import Vector1 from "$lib/components/loginService/Vector(1).svg"
    import Logo from "$lib/assets/Logo_head.png";
    import { eyeOff, eye, informationCircleOutline, open } from 'ionicons/icons';
    import { alertController } from 'ionic-svelte';
	import type { KeycloakInitOptions, KeycloakConfig } from 'keycloak-js';
	import { keyCloakStore } from "$stores/keycloak.store";
	import Keycloakthings from "$src/routes/login/core";
    import { page } from '$app/stores';
    import { App, URLOpenListenerEvent } from '@capacitor/app';
	import { onMount } from 'svelte';

    const isProduction = process.env.NODE_ENV === 'production';

    console.log("LOGIN PAGE");
    $: console.log($page.url.href);

    let invalidData = false;
    let isVisible = false;

    onMount(async () => {
        await App.addListener('appUrlOpen', function (event) {
            // slug = /tabs/tabs2
            const slug = event.url.split('#')[1];
            console.log(event.url);
            console.log(slug);
    
            goto(`authenticate#${slug}`);
    
            // We only push to the route if there is a slug present
            // if (slug) {
            // 	goto(slug);
            // }
        });
        
        console.log("LOGIN PAGE");
        console.log(await Keycloakthings.updateToken(1));
    })

</script>


<ion-content fullscreen>
    
    <div style="position: relative; width: 100%; height: 40%; ">
        <img src={Vector} alt="Vector" style="position: absolute; width: 110%; height:70%">
        <img src={Vector1} alt="Overlay Icon" style="width: 110%; height:85%">
    </div>

    <div style="display: flex; flex-direction: column; align-items: center; margin-top: -40px; justify-content: top; padding-right:20px; padding-left:20px;">
        <img src={Logo} alt="Aristomate logo" style="width: 30%; margin-bottom: 25px;">
		<!-- <ion-text style="color: var(--ion-color-primary)">
			Καλώς ήρθες στο Aristomate!
		</ion-text> -->
        <div class="academiclogin" style="display:flex; flex-direction:row; align-items: center; justify-content: center; gap: 4px;">
            <ion-text>Καλώς ήρθες στο Aristomate!</ion-text>
        </div>


        {#if invalidData}
            <ion-label class="error">Λανθασμένα στοιχεία σύνδεσης</ion-label>
        {/if}
        {#if isVisible}
            <div class="loading-panel">
                <ion-spinner class="loginSpinner"></ion-spinner>
                <p class="loginP">Περιμένετε...</p>
            </div>
        {/if}
      
        <ion-button aria-hidden class="custom" on:click={() => Keycloakthings.login({scope:"students:read"})} style="margin-top:2rem;">Σύνδεση ΑΠΘ</ion-button>
        <div class="footer">
            <ion-title size="small" color="primary" style="padding-bottom: 15px; font-size: small;">Powered by <strong>ACM AUTH</strong> and <br /> the <strong>School of Informatics</strong>.</ion-title>
        </div>
    </div>


</ion-content>
  
<style>
    .footer {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding-top: 35px;
		position: absolute;
		bottom: 0;
    }

    .academiclogin {
        color: #98BDD6;
        margin-bottom: 10px;
        /* font-weight: bold; */
    }


    ion-button.custom {
        --background: var(--ion-color-primary);
        --color: var(--ion-color-light);
        --border-radius: 1rem; 
        --box-shadow: var(--shadow-sort-md);
        width: 60%; 
        height: 3rem; 
    }
    


    .loading-panel {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }

    ion-spinner.loginSpinner {
        --color: white;
        margin-right: 10px; 
    }

    p.loginP {
        color: white;
        margin: 0; 
    }

    
  
</style>
