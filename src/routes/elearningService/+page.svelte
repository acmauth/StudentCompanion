<script lang='ts'>
    import { elearningGet, elearningFetchNewTokenInternal } from "$lib/elearningAuthentication/elearningDataService"
    import UserInfoStore from "../../stores/userinfo.store";
    import { goto } from '$app/navigation';
	import { onMount } from "svelte";
	import { get } from "svelte/store";
    
    
    // This is a simple login page that gets a user token and stores it in the browser.

    // export const load: PageLoad = ({ params }) => {
	// return {
	// 	post: {
	// 		title: `Title for ${params.slug} goes here`,
	// 		content: `Content for ${params.slug} goes here`,
	// 	    },
	//     };
    // };

        let messages = []
    
        
        async function fetchMessages() {
            const body = [
                {
                    "index": 0,
                    "methodname": "core_message_get_messages",
                    "args": {
                        "useridto": get(UserInfoStore).userId,
                        "useridfrom": "0",
                        "type": "notifications",
                        "newestfirst": 1,
                        "read": 1,
                        "limitfrom": 0,
                        "limitnum": 21
                    }
                }
            ];
            
            const response = elearningGet(body)

            const data = await response;
            return data;
        }

        onMount(async () => {
            const response = await fetchMessages();
            console.log(response);
            if (response) {
                messages = response[0].data.messages;
            } else {
                messages = [{smallmessage: "No messages found"}]
            }
        });

    let username = '';
    let password = '';
    let outputMessage = ''

    async function submit(){
        // Using the username and password, we're calling the tokenGrab function to get an authentication token.
        
        // URL-encode the password
        const encodedPassword = encodeURIComponent(password);

        const response = await elearningFetchNewTokenInternal(username, encodedPassword);
        if (response.error){
            outputMessage = response.error;
        }
        else {
            outputMessage = "Login successful!"
        }
    }
</script>

<h1>Login</h1>

{#each messages as message}
    <p>{message.subject}</p>
{/each}

<!-- {#await fetchMessages() then value}
    {#each value[0].data.messages as message}
        <p>{message.smallmessage}</p>
    {/each}
{/await} -->

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