<script lang='ts'>
    import { tokenGrab } from "$lib/universisAuthentication/tokenGeneratorWorker"
    import { userCreds, userTokens } from "../../stores/credentials.store";
    import userInfoStore from "../../stores/userinfo.store";
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

<h1>Login</h1>

<form>
    <label>
        Username:
        <input type="text" bind:value={username} />
    </label>
    <label>
        Password:
        <input type="password" bind:value={password} />
    </label>
    <button type="submit" on:click={submit}>Submit</button>
</form>
<p>{outputMessage}</p>

<ion-button on:click={logOut}>Log out</ion-button>