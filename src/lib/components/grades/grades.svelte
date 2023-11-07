<script>
// @ts-nocheck
	import * as allIonicIcons from 'ionicons/icons';
	import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";
	import Card from "./gradeCard.svelte";

    let subjects = [];
    let grades = [];

    onMount(async () => {

        grades = (await universisGet("students/me/grades?$top=-1")).value;

        subjects = (await universisGet("students/me/courses?$top=-1")).value;


    });

	

</script>


<!-- Card -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#each subjects as subject } 
 <Card subject = {subject}/>

{/each}

