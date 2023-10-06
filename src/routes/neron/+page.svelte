<script>
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";

    onMount(async () => {
        console.log(await universisGet("users/me"))
    });
    
</script>

<h1>These are the todos</h1>

<footer>The end</footer>
