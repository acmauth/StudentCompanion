<script lang='ts'>
    import { tokenGrab } from "$lib/universisAuthentication/tokenGeneratorWorker"
    import { userCreds, userTokens } from "$stores/credentials.store";
    import userInfoStore from "$stores/userinfo.store";
    import { goto } from '$app/navigation';
    import { elearningFetchNewToken } from "$lib/elearningAuthentication/elearningDataService";
    import { IonButton } from "@ionic/core/components/ion-button";
    import { getUniversisToken, getElearningToken} from "./helpers"
    import { invalidateAuth } from "$lib/authentication/authValidator";

    let username = '';
    let password = '';
    let outputMessage = ''

    async function submit(){

        let universisOutput = await getUniversisToken(username, password);
        let elearningOutput = await getElearningToken(username, password);
        
        outputMessage = universisOutput + " " + elearningOutput;
        goto("/");

    }

    function logOut(){
        invalidateAuth();
        goto("/");
    }

</script>

    <div style="position: relative; width: 100%; height: 50%;">
        <img src="src/lib/components/loginService/Vector.svg" alt="Vector Icon" style="position: absolute; width: 100%; height:75%">
        <img src="src/lib/components/loginService/Vector(1).svg" alt="Overlay Icon" style="width: 100%; height:95%">
    </div>

    <div style="display: flex; flex-direction: column; align-items: center; justify-content: top; height: 80%; padding-top: 2px; padding-right:20px; padding-left:20px;">
        <ion-input id='usernameInput' class="custom" placeholder="Username" fill="outline" style="margin-bottom: 10px;"></ion-input> 
        <ion-input id='passwordInput' class="custom" type="password" placeholder="Password" fill="outline" style="margin-bottom: 25px;"></ion-input>
        <ion-button class="custom" on:click={submit}>Log In</ion-button>
        <ion-button class="custom" on:click={logOut}>Log Out</ion-button>
    </div>
  
<style>
    ion-input.custom {
      --background:#F9FAFB;
      --color: #98BDD6;
      --placeholder-color: #98BDD6;
      --placeholder-opacity: 0.8;
      --border-color: #98BDD6;
      --border-radius: 1rem; /* Adjust as needed */
      --border-width: 1.7px;
      width: 80%;
    }

    ion-button.custom {
        --background: #55BBFF;
        --color: #fff;
        --border-radius: 2.5rem; /* Adjust as needed */
        width: 80%; 
        height: 3.5rem; /* Adjust as needed */
    }
</style>
