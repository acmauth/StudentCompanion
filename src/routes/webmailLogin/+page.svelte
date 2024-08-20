<script lang='ts'>
    import { alertController } from 'ionic-svelte';
    import { checkmark, informationCircleOutline, reloadOutline } from 'ionicons/icons';
	import { getElearningToken } from '$components/loginService/helpers';
    import { toastController } from 'ionic-svelte';
	import type { ToastOptions } from '@ionic/core';
	import { goto } from '$app/navigation';
	import { webmailInboxRequest } from '$src/lib/-webmail/dataService/core';

    const isProduction = process.env.NODE_ENV === 'production';
    let authenticating: boolean = false;
    let loginFailed: boolean = false;
    let loginIcon = checkmark;

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

    async function submit(){
        
        authenticating = true;

        let username = (document.getElementById('username') as HTMLInputElement).value.trim();
        let password = (document.getElementById('password') as HTMLInputElement)?.value;
        
        let elearningOutput = await getElearningToken(username, password);
        let webmailOutput = await webmailInboxRequest();
    
        console.log(elearningOutput, webmailOutput);
        authenticating = false;
        
        if (elearningOutput || !webmailOutput) { 
            loginFailed = true;

            showToast({
                color: 'danger',
                duration: 2000,
                message: 'Αποτυχία σύνδεσης!',
                mode: 'ios',
                translucent: true,
                layout: 'baseline',
                positionAnchor: "bottom",
            });

            const usernameInput = document.getElementById('username') as HTMLIonInputElement;
            const passwordInput = document.getElementById('password') as HTMLIonInputElement;
            usernameInput?.setFocus();
            passwordInput.value = "";
        }
        else {
            loginFailed = false;

            showToast({
                color: 'success',
                duration: 2000,
                message: 'Επιτυχής σύνδεση!',
                mode: 'ios',
                translucent: true,
                layout: 'baseline',
                positionAnchor: "bottom",
            });

            goto("/pages/homepage");
        }


    }
</script>

    
<ion-card>

    <div style="padding: 5%; color:var(--ion-color-dark); padding-bottom:2%">
        <div style="margin-bottom:5%; font-size:large;">
            Ολοκλήρωσε την εμπειρία σου!
        </div>
        
        <div style="margin-bottom: 2%">
            Αποθήκευσε τον ιδρυματικό σου λογαριασμό απευθείας στη συσκευή σου για να λαμβάνεις ειδοποιήσεις από το webmail και το eLearning!
            {#if isProduction}
                <ion-icon src={informationCircleOutline} on:click={showAlert} aria-hidden/>
            {/if}
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

            <div style="display:flex; align-self:center; justify-content: space-between;">
                {#if authenticating}
                    <ion-spinner name="crescent" color="primary" style="align-self:center;"></ion-spinner>
                {:else}
                    <ion-button shape="round" size="small" id="login" on:ionFocus={submit}> 
                        <ion-icon slot="icon-only" id="checkmark" icon={loginIcon}></ion-icon>
                    </ion-button>
                {/if}
            </div>
    </div>
</ion-card>
    