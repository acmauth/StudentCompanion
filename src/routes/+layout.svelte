<script>
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
    import { validateAuth, invalidateAuth } from "$lib/universisAuthentication/authValidator";


    // +layout runs over all components below it. This is a good place to put authentication checks.
    // Here we're using it to check if the user is logged in, and if not, redirect them to the login page.

    // Checking if we're outside the login page and don't have a valid authentication state
    // onMount(async () => {
    //     if ($page.url.pathname != 'loginService' && !(await validateAuth())){
    //         goto('loginService');
    //     }
    // });

    function logout(){
        invalidateAuth();
        goto('loginService');
    }

</script>

<a href="/"><button>Home</button></a>
<button on:click={logout}>Log out</button>
<slot/>