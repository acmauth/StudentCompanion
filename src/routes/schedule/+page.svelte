<script lang="ts">
	import { goto } from "$app/navigation";
	import { getDayByIndex } from "$components/schedule/day/days";
	import { onMount } from "svelte";

    onMount(() => {
        goto("/schedule/classes/" + getDayByIndex(new Date().getDay()).toLowerCase());
    });
</script>
