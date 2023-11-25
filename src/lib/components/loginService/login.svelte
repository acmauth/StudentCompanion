<script lang='ts'>
    import { tokenGrab } from "$lib/authentication/tokenGeneratorWorker"
    import { userCreds } from "$lib/authentication/authStore";
    import { goto } from '$app/navigation';
    import {validateAuth, invalidateAuth} from "$lib/authentication/authValidator";
	import IonPage from "ionic-svelte/components/IonPage.svelte";
    import * as allIonicIcons from 'ionicons/icons';
 
   
    // This is a simple login page that gets a user token and stores it in the browser.

    // export const load: PageLoad = ({ params }) => {
	// return {
	// 	post: {
	// 		title: `Title for ${params.slug} goes here`,
	// 		content: `Content for ${params.slug} goes here`,
	// 	    },
	//     };
    // };

    var username ;
    var password ;
    let outputMessage = ''
    
    async function submit(){
        // Using the username and password, we're calling the tokenGrab function to get an authentication token.
        
        // URL-encode the password
        username = document.getElementById('usernameInput');
        password = document.getElementById('passwordInput');
        
            var username = username.value;
            var password = password.value;
            console.log(username)
            const encodedPassword = encodeURIComponent(password);

            const response = await tokenGrab(username, encodedPassword);
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
        

    function logOut(){
        invalidateAuth();
        goto("/");
    }

</script>

<IonPage>
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
</IonPage>
  
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
