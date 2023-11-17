<script>
    // import {activeDay} from "./activeDay"; 
    import DayCard from "./dayTitle.svelte";
    import { weekdays } from "./days";

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
    }
</style>


