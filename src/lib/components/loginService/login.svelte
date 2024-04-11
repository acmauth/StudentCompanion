<script lang='ts'>
    import { goto } from '$app/navigation';
    import { getUniversisToken, getElearningToken} from "./helpers"
    import Vector from "$lib/components/loginService/Vector.svg"
    import Vector1 from "$lib/components/loginService/Vector(1).svg"
    import Logo from "$lib/assets/Logo_head.png";

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

</script>


<ion-content fullscreen>
    
    <div style="position: relative; width: 100%; height: 40%; ">
        <img src={Vector} alt="Vector" style="position: absolute; width: 110%; height:70%">
        <img src={Vector1} alt="Overlay Icon" style="width: 110%; height:85%">
    </div>

    <div style="display: flex; flex-direction: column; align-items: center; margin-top: -40px; justify-content: top; padding-right:20px; padding-left:20px;">
        <img src={Logo} alt="Aristomate logo" style="width: 30%; margin-bottom: 25px;">
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
    
        <ion-button aria-hidden class="custom" on:click={submit} style="margin-bottom:20px; margin-top:20px;">ΕΙΣΟΔΟΣ</ion-button>
        <!-- <ion-checkbox label-placement="start" style="margin-top: 5px; margin-bottom:15px" class="custom" checked={true}> 
            <ion-label class="custom" style="font-size:small;">Διατήρηση σύνδεσης</ion-label>
        </ion-checkbox> -->

        <div class="footer">
            <ion-title size="small" color="primary" style="padding-bottom: 15px; font-size: small;">Powered by <strong>ACM AUTH</strong></ion-title>
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
    }

    ion-input.custom {
      --background:#F9FAFB;
      --color: var(--ion-color-primary);
      --placeholder-color: #98BDD6;
      --placeholder-opacity: 0.8;
      --border-color: #98BDD6;
      --border-radius: 1rem; 
      --border-width: 1.8px;
      width: 80%;

    }

    ion-button.custom {
        --background: var(--ion-color-primary);
        --color: var(--ion-color-light);
        --border-radius: 1rem; 
        --box-shadow: var(--shadow-sort-md);
        width: 60%; 
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
        margin-right: 10px; 
    }

    p.loginP {
        color: white;
        margin: 0; 
    }

</style>
