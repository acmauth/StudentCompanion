<script>
	import { onMount } from "svelte";
    import {activeDay, getToday} from "./activeDay"; 
    import DayCard from "./dayTitle.svelte";
    import { weekdays } from "./days";
    import * as allIonicIcons from 'ionicons/icons';


    onMount(async () => {

        const allIcons = document.querySelectorAll('ion-icon');
		allIcons.forEach(icon => {
		icon.icon = allIonicIcons.ellipseOutline;
		});

        activeDay.set(getToday());
    });


</script>

<div class="dayList">
{#each weekdays as day}
    {#each Object.keys(day) as key }
        <DayCard day={key.charAt(0).toUpperCase() + key.slice(1)}/>
    {/each}
{/each}
</div>

<style>
    .dayList {
        display: flex;
        justify-content: space-evenly;
        width: 100%;
        padding-inline: 5%;
        padding-top: 3%;
    }
</style>


