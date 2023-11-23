<script lang='ts'>
    import { tokenGrab } from "$lib/authentication/tokenGeneratorWorker"
    import { userCreds } from "$lib/authentication/authStore";
    import { goto } from '$app/navigation';
    import {validateAuth, invalidateAuth} from "$lib/authentication/authValidator";
	import { IonButton } from "@ionic/core/components/ion-button";
    import { IonInput } from "@ionic/core/components/ion-input"
    import { IonLabel } from "@ionic/core/components/ion-label";
	import IonNav from "ionic-svelte/components/IonNav.svelte";
	import IonPage from "ionic-svelte/components/IonPage.svelte";
	import { Icon } from "ionicons/dist/types/components/icon/icon";
 
   
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
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; padding: 20px;">
        
        <ion-input id='usernameInput' class="custom" placeholder="Username" fill="outline" style="margin-bottom: 20px;"></ion-input>
        <ion-input id='passwordInput' class="custom" type="password" placeholder="Password" fill="outline" style="margin-bottom: 40px;"></ion-input>
      

        <ion-button on:click={submit}>Log In</ion-button>
        <ion-button on:click={logOut}>Log Out</ion-button>

            
       

    </div>
</IonPage>
  
<style>
    ion-input.custom {
      --background:#F9FAFB;
      --color: #98BDD6;
      --placeholder-color: #98BDD6;
      --placeholder-opacity: 0.8;
      --border-color: #98BDD6;
      --border-radius: 10px;
      --border-width: 2px;
    }

    ion-button {
        --background: #55BBFF;
        --color: #fff;
        --border-radius: 30px;
        width: 100%; 
        height: 6%
    }

  </style>