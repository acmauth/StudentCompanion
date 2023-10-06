<script>
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";

    let username = "";

    onMount(async () => {
        let personalData = await universisGet("users/me");
        username = personalData.name;
    });
    
</script>


<p>Hello {username}</p>


