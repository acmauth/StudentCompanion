<script>
    import getTodos from "./logic";
    import { onMount } from "svelte";

    let todos = [];

    onMount(async () => {
        todos = await getTodos();
    });
    
</script>

<h1>These are the todos</h1>

{#each todos as todo}
    <p>{todo.title}</p>
{/each}

<footer>The end</footer>
