<script lang='ts'>
    import { tokenGrab } from "$lib/universisAuthentication/tokenGeneratorWorker"
    import { userCreds, userTokens } from "$stores/credentials.store";
    import userInfoStore from "$stores/userinfo.store";
    import { goto } from '$app/navigation';
    import { elearningFetchNewToken } from "$lib/elearningAuthentication/elearningDataService";
    import { IonButton } from "@ionic/core/components/ion-button";
    import { getUniversisToken, getElearningToken} from "./helpers"
    import { invalidateAuth } from "$lib/authentication/authValidator";
    import Vector from "$lib/components/loginService/Vector.svg"
    import Vector1 from "$lib/components/loginService/Vector(1).svg"

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
        }
        else {
            isVisible = false;
            goto("/");
        }

    }


</script>

    <div style="position: relative; width: 100%; height: 55%; ">
        <img src={Vector} alt="Vector" style="position: absolute; width: 100%; height:80%">
        <img src={Vector1} alt="Overlay Icon" style="width: 100%; height:95%">
    </div>

    <div style="display: flex; flex-direction: column; align-items: center; justify-content: top; height: 80%; padding-top: 2px; padding-right:20px; padding-left:20px;">
        <ion-input id='usernameInput' class="custom" placeholder="Username" fill="outline" style="margin-bottom: 10px;"></ion-input> 
        <ion-input id='passwordInput' class="custom" type="password" placeholder="Password" fill="outline" style="margin-bottom: 10px;" ></ion-input>
        {#if invalidData}
            <ion-label class="error"> Invalid username or password</ion-label>
        {/if}
        {#if isVisible}
            <div class="loading-panel">
                <ion-spinner></ion-spinner>
                <p>Loading...</p>
            </div>
        {/if}

        <ion-button class="custom" on:click={submit} style="margin-bottom:20px; margin-top:20px;">Log In</ion-button>
        <ion-checkbox label-placement="start" style="margin-bottom:15px" class="custom" checked="true"> 
            <ion-label class="custom"> Remember me</ion-label>
        </ion-checkbox>
    </div>
  
<style>
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
        --color: #fff;
        --border-radius: 2.5rem; 
        width: 80%; 
        height: 3.5rem; 
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
        text-decoration: underline;
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

  ion-spinner {
    --color: white;
    margin-right: 10px; /* Adjust the margin as needed */
  }

  p {
    color: white;
    margin: 0; /* Remove default margin */
  }

</style>
