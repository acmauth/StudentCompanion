<script>
	import { onMount } from "svelte";
    import {activeDay, getToday} from "./activeDay";
    import Day from "./day.svelte";
    import { weekdays } from "./days";

    onMount(async () => { activeDay.set(getToday()); });
</script>


<ion-segment value={$activeDay}>
    {#each weekdays as day}
        {#each Object.keys(day) as key }
            <Day day={key.charAt(0).toUpperCase() + key.slice(1)}/>
        {/each}
    {/each}
</ion-segment>

<style>
	ion-segment {
		padding: 5px;
        background-color: transparent;
	}
</style>