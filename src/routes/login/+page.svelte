<script lang='ts'>
    import { goto } from '$app/navigation';
    import Vector from "$lib/components/loginService/Vector.svg"
    import Vector1 from "$lib/components/loginService/Vector(1).svg"
    import Logo from "$lib/assets/Logo_head.png";
	import Keycloakthings from "$src/routes/login/core";
    import { helpCircle } from 'ionicons/icons';
    import { page } from '$app/stores';
    import { App } from '@capacitor/app';
	import { onMount } from 'svelte';

    const isProduction = process.env.NODE_ENV === 'production';

    console.log("LOGIN PAGE");
    $: console.log($page.url.href);

    let invalidData = false;
    let isVisible = false;

    let token_expiry = $page.url.searchParams.get('token_expiry');

    let inlineModalOpen = false;

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
        
        {#if token_expiry}
            <div style="display: flex; flex-direction:row; align-items:center" on:click={() => {inlineModalOpen = true}} aria-hidden>
                <ion-label style="color: var(--ion-color-primary)">Γιατί με πετάει</ion-label> <ion-icon src={helpCircle} style="width: 2rem; height: 2rem; color: var(--ion-color-primary)" alt="Why am I getting kicked"/>
            </div>

            <ion-modal
                is-open={inlineModalOpen}
                initial-breakpoint={0.5}
                breakpoints = {[0.5, 0.8]}
                handle-behavior="cycle">
                <ion-content>
                    <div class="mainContainer">
                        <ion-item-group>
                            <ion-item lines="none">
                                <ion-text>
                                    <h2>Γιατί με πετάει κάθε μέρα;</h2>
                                </ion-text>
                            </ion-item>
                            <ion-item-divider>
                                <!-- <ion-label>Κάτι κάτι </ion-label> -->
                            </ion-item-divider>                    
                            <ion-accordion-group  expand="inset">
                                <ion-accordion value="first">
                                    <ion-item slot="header" color="light">
                                    <ion-label>Απλή απάντηση</ion-label>
                                    </ion-item>
                                    <div class="ion-padding" slot="content">
                                        Αυτή τη στιγμή, όταν συνδέεσαι στην εφαρμογή, το ΑΠΘ μας δίνει πρόσβαση για έως και 7 ώρες. Αυτό είναι αρκετό για χρήση σε ιστοσελίδες, αλλά δεν βολεύει για εφαρμογές στο κινητό, όπως η δική μας. Έχουμε ήδη ενημερώσει το ΑΠΘ για το πρόβλημα και περιμένουμε να μας δώσουν μια λύση.
                                    </div>
                                </ion-accordion>
                                <ion-accordion value="second">
                                    <ion-item slot="header" color="light">
                                    <ion-label>Τεχνική απάντηση</ion-label>
                                    </ion-item>
                                    <div class="ion-padding" slot="content">Η εφαρμογή χρησιμοποιεί το πρωτόκολλο OAuth για να συνδεθείς στα συστήματα του ΑΠΘ (εκτός του webmail) χωρίς να βλέπουμε ποτέ τους κωδικούς σου (αυτό είναι πιο ασφαλές). Όταν συνδέεσαι, σε κατευθύνουμε σε μια σελίδα του ΑΠΘ, και αφού ολοκληρωθεί η σύνδεση, λαμβάνουμε έναν προσωρινό κωδικό (refresh token) για να βλέπει η εφαρμογή πρόσβαση τις πληροφορίες που δείχνει. Ο κωδικός αυτός λήγει μετά από 7 ώρες.<br>
                                        Αυτό είναι σχεδιασμένο με βάση τη χρήση των συστημάτων του ΑΠΘ σε ιστοσελίδες, όπου 7 ώρες είναι αρκετές. Όμως σε εφαρμογές, οι χρήστες περιμένουν να παραμένουν συνδεδεμένοι για πολύ περισσότερο. Δυστυχώς, το σύστημα αυτό διαχειρίζεται το Κέντρο Ηλεκτρονικής Διακυβέρνησης του ΑΠΘ, οπότε δεν μπορούμε να το αλλάξουμε εμείς. Έχουμε αναφέρει την ανάγκη για μεγαλύτερη διάρκεια, και το ΑΠΘ μας έχει ενημερώσει ότι εξετάζουν λύσεις, αλλά απαιτείται χρόνος για να γίνουν οι απαραίτητες αλλαγές.
                                    </div>
                                </ion-accordion>
                            </ion-accordion-group>
                        </ion-item-group>
                    </div>
                </ion-content>
            </ion-modal>
        {/if}


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
