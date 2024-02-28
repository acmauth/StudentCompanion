<script lang='ts'>
    import { goto } from '$app/navigation';
    import { getUniversisToken, getElearningToken} from "./helpers"
    import Vector from "$lib/components/loginService/Vector.svg"
    import Vector1 from "$lib/components/loginService/Vector(1).svg"
    import Logo from "$lib/assets/Logo_full_white.png";
    import { onMount } from 'svelte';


    let username = '';
    let password = '';
    let outputMessage = ''
    let invalidData = false;
    let isVisible = false;


    async function submit(){
        
        isVisible = true;

        username = (document.getElementById('usernameInput') as HTMLInputElement).value;
        password = (document.getElementById('passwordInput') as HTMLInputElement)?.value;
        
        let universisOutput = await getUniversisToken(username, password);
        let elearningOutput = await getElearningToken(username, password);
        

        if (universisOutput || elearningOutput) { 
            isVisible = false;
            invalidData = true;
            outputMessage = universisOutput + ",-," + elearningOutput;
        }
        else {
            isVisible = false;
            goto("/pages/homepage");
        }


    }

    function handleKeyboardVisibility(event: { type: string; }) {
        const formContainer = document.getElementById('formContainer');
        if (formContainer) {
            if (event.type === 'focusin') {
                // Adjust your layout when the keyboard is shown
                formContainer.style.transform = 'translateY(-50px)';
            } else {
                // Adjust your layout when the keyboard is hidden
                formContainer.style.transform = 'translateY(0)';
            }
        }
    }

    onMount(() => {
        const usernameInput = document.getElementById('usernameInput');
        const passwordInput = document.getElementById('passwordInput');

        if (usernameInput && passwordInput) {
            // Attach event listeners to handle keyboard visibility
            usernameInput.addEventListener('focusin', handleKeyboardVisibility);
            passwordInput.addEventListener('focusin', handleKeyboardVisibility);
            usernameInput.addEventListener('focusout', handleKeyboardVisibility);
            passwordInput.addEventListener('focusout', handleKeyboardVisibility);
        }
    });

</script>

<div style="position: relative; width: 100%; height: 40%; ">
    <img src={Vector} alt="Vector" style="position: absolute; width: 100%; height:80%">
    <img src={Vector1} alt="Overlay Icon" style="width: 100%; height:95%">
    <img src={Logo} alt="Aristomate logo" style="position: absolute; top: 20%; left: 20%; width: 60%">
</div>

<div style="display: flex; flex-direction: column; align-items: center; justify-content: top; padding-top: 2px; padding-right:20px; padding-left:20px;">
    <ion-title color="primary" size="large" style="padding-bottom: 30px;">Σύνδεση</ion-title>
    <ion-input id='usernameInput' class="custom" placeholder="Όνομα χρήστη" fill="outline" style="margin-bottom: 10px;"></ion-input> 
    <ion-input id='passwordInput' class="custom" type="password" placeholder="Κωδικός πρόσβασης" fill="outline" style="margin-bottom: 10px;" ></ion-input>
    {#if invalidData}
        <ion-label class="error">Λανθασμένα στοιχεία σύνδεσης</ion-label>
    {/if}
    {#if isVisible}
        <div class="loading-panel">
            <ion-spinner class="loginSpinner"></ion-spinner>
            <p class="loginP">Περιμένετε...</p>
        </div>
    {/if}

    <ion-button class="custom" on:click={submit} style="margin-bottom:20px; margin-top:20px;">ΕΙΣΟΔΟΣ</ion-button>
    <ion-checkbox label-placement="start" style="margin-top: 5px; margin-bottom:15px" class="custom" checked="true"> 
        <ion-label class="custom" style="font-size:small;">Διατήρηση σύνδεσης</ion-label>
    </ion-checkbox>
</div>

<div class="footer">
    <ion-title size="small" color="primary" style="padding-bottom: 10px; font-size: small;">Powered by ACM AUTH</ion-title>
</div>
  
<style>
    .footer {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        position: absolute;
        top: 95%;
        width: 100%;
    }

    ion-input.custom {
      --background:#F9FAFB;
      --color: #024f82;
      --placeholder-color: #98BDD6;
      --placeholder-opacity: 0.8;
      --border-color: #98BDD6;
      --border-radius: 1rem; 
      --border-width: 1.8px;
      width: 80%;
    }

    ion-button.custom {
        --background: #55BBFF;
        --color: var(--ion-color-light);
        --border-radius: 1rem; 
        width: 40%; 
        height: 3rem; 
    }

    ion-checkbox.custom {
        --border-color: #98BDD6;
        --checkbox-background: #fff;
        --border-color-checked: #5fbcfa;
        --checkmark-color: #fff;
        --checkbox-background-checked: #5fbcfa;
        --size: 15px;
    }

    ion-label.custom {
        color: #3b8abf;
        font-size: 1rem;
    }

    ion-label.error {
        color: rgb(191, 59, 59);
        font-size: 1rem;
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
        margin-right: 10px; /* Adjust the margin as needed */
    }

    p.loginP {
        color: white;
        margin: 0; /* Remove default margin */
    }

</style>
