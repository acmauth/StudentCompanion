<script lang='ts'>
    import { tokenGrab } from "$lib/authentication/tokenGeneratorWorker"
    import { userCreds } from "$lib/authentication/authStore";
    import { goto } from '$app/navigation';
    
    
    // This is a simple login page that gets a user token and stores it in the browser.

    let username = '';
    let password = '';
    let outputMessage = ''

    async function submit(){
        // Using the username and password, we're calling the tokenGrab function to get an authentication token.
        const response = await tokenGrab(username, password);
        if (response.error){
            outputMessage = response.error;
        }
        else {
            userCreds.set({
                username: username,
                password: password,
                token: response.token
            });
            goto("/");
            outputMessage = "Login successful!"
        }
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