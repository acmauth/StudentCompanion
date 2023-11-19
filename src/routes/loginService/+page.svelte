<script lang='ts'>
    import { tokenGrab } from "$lib/universisAuthentication/tokenGeneratorWorker"
    import { userCreds, userTokens } from "../../stores/credentials.store";
    import userInfoStore from "../../stores/userinfo.store";
    import { goto } from '$app/navigation';
    import { elearningFetchNewToken } from "$lib/elearningAuthentication/elearningDataService";
    
    // This is a simple login page that gets a user token and stores it in the browser.

    // export const load: PageLoad = ({ params }) => {
	// return {
	// 	post: {
	// 		title: `Title for ${params.slug} goes here`,
	// 		content: `Content for ${params.slug} goes here`,
	// 	    },
	//     };
    // };

    let username = '';
    let password = '';
    let outputMessage = ''
    
    async function getUniversisToken() {
        const encodedPassword = encodeURIComponent(password);

        const response = await tokenGrab(username, encodedPassword);
        if (response.error){
            outputMessage = response.error;
            outputMessage = outputMessage + "Universis failed!"
        }
        else {
            userCreds.set({
                username: username,
                password: password
            });
            
            userTokens.update((newTokens) => {
                newTokens.universis.token = response.token;
                console.log(response);
                return newTokens;
            });

            outputMessage = outputMessage + "Universis!"
        } 
    }
    
    async function getElearningToken() {
        const encodedPassword = encodeURIComponent(password);

        const response = await elearningFetchNewToken(username, encodedPassword);
        if (!response.error && response.credentials){
        userTokens.update((newTokens) => {
            newTokens.elearning.moodleSession = response.credentials.moodleSession;
            newTokens.elearning.sesskey = response.credentials.sesskey;
            return newTokens;
        });
        userInfoStore.update((newUserInfo) => {
            newUserInfo.userId = response.credentials.userID;
            newUserInfo.valid = true;
            return newUserInfo;
        });
        outputMessage = outputMessage + "Elearning!"
        } else {
            outputMessage = outputMessage + "Elearning failed!"
        }

    }

    async function submit(){
        // Using the username and password, we're calling the tokenGrab function to get an authentication token.
        
        await getUniversisToken();
        await getElearningToken();
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