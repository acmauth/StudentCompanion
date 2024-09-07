<script lang='ts'>
    import { alertController } from 'ionic-svelte';
    import { checkmark, informationCircleOutline, reloadOutline } from 'ionicons/icons';
    import sisAuthenticator from "$lib/-universis/authenticator/core";
    import { toastController } from 'ionic-svelte';
	import type { ToastOptions } from '@ionic/core';
	import { goto } from '$app/navigation';
	import { userCreds } from '$stores/credentials.store';

    const isProduction = process.env.NODE_ENV === 'production';


    let authenticating: boolean = false;
    let loginFailed: boolean = false;
    let loginIcon = checkmark;

    export let flag;

    $: loginIcon = loginFailed ? reloadOutline : checkmark;

    const showAlert = async () => {
        const options = {
            header: 'Είναι ασφαλή τα στοιχεία μου;',
            subHeader: "Πάντα!",
            message: 'Η ομάδα του Aristomate δεσμεύεται ότι δεν έχει ποτέ πρόσβαση σε αυτά τα στοιχεία.',
            buttons: ['ΟΚ']
        };
        const alert = await alertController.create(options);
        alert.present();
    };
    
    async function showToast(toast: ToastOptions){
		const toast_ = await toastController.create(toast);
		toast_.present();
	}

    async function checkCredsValidity(username: string, password: string) {    
        const authResult = await sisAuthenticator(username, password);
        
        if (authResult.error || authResult.message == 'Unauthorized') {
            return false;
        }
        
        userCreds.set({
            username: username,
            password: password
        });

        return true;
    }


    async function submit(){        
        authenticating = true;

        let username = (document.getElementById('username') as HTMLInputElement).value.trim();
        let password = (document.getElementById('password') as HTMLInputElement)?.value;

        
        const validity = await checkCredsValidity(username, password);

        if (!validity || !password || !username) { 
            loginFailed = true;
            
            showToast({
                color: 'danger',
                duration: 1000,
                message: 'Αποτυχία σύνδεσης!',
                mode: 'ios',
                translucent: true,
                layout: 'stacked',
            });

            const usernameInput = document.getElementById('username') as HTMLIonInputElement;
            const passwordInput = document.getElementById('password') as HTMLIonInputElement;
            usernameInput?.setFocus();
            passwordInput.value = "";

        }
        else {
            loginFailed = false;
            flag = true;
            
            showToast({
                color: 'success',
                duration: 1000,
                message: 'Επιτυχής σύνδεση!',
                mode: 'ios',
                translucent: true,
                layout: 'stacked',
            });
        }
        
        authenticating = false;
    }
</script>


<ion-card style="margin-block: 1rem; margin-block-end: 1.7rem">

    <div style="padding: 5%; color:var(--ion-color-dark); padding-bottom:2%">
        <div style="margin-bottom:5%; font-size:large; display:flex; justify-content:space-between; align-items:center;">
            Ολοκλήρωσε την εμπειρία σου!
            <div style="display:flex; align-self:end; justify-content: space-between;">
                {#if authenticating}
                <ion-spinner name="crescent" color="primary" style="align-self:center;"></ion-spinner>
                {:else}
                <ion-button shape="round" size="small" id="login" on:ionFocus={submit}> 
                    <ion-icon slot="icon-only" id="checkmark" icon={loginIcon}></ion-icon>
                </ion-button>
                {/if}
            </div>
        </div>
        
        <div style="margin-bottom: 2%">
            Αποθήκευσε τον ιδρυματικό σου λογαριασμό απευθείας στη συσκευή σου για να λαμβάνεις ειδοποιήσεις από το webmail και το eLearning!
            <ion-icon src={informationCircleOutline} on:click={showAlert} aria-hidden/>
        </div>
        
        <div style="display:flex; flex-direction:column; margin-top:0; padding-bottom:2%;">
            
            <ion-input
            label="Ιδρυματικό όνομα χρήστη"
            label-placement="floating"
            id="username"
            type="text"
            contenteditable="true"
            spellcheck={false}
            clear-input={true}
            style="margin-bottom:0%; padding-bottom:0;"
            />
            
            <ion-input
            label="Κωδικός πρόσβασης"
            label-placement="floating"
            id="password"
            type="password"
            contenteditable="true"
            style="margin-bottom:5px;"
            spellcheck={false}
            clear-input={true}
            />
    </div>
</div>

</ion-card>