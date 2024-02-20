<script lang="ts">
	import { goto } from '$app/navigation';
	import { ellipse, ellipseOutline } from 'ionicons/icons';
	import { getDayIndex, getDayByIndex } from "$lib/components/schedule/day/days";
	export let day: string;
	export let activeDay: string;
</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<ion-grid on:click={() => { goto(`/schedule/classes/${day.toLowerCase()}`)}}>
	<ion-row class="ion-align-items-center ion-justify-content-center" style="padding: 3%; font-size: 200%">
		<ion-icon icon={activeDay.toLowerCase() == day.toLowerCase() ? ellipse : ellipseOutline} color="primary"/>
	</ion-row >
	<ion-row class="ion-align-items-center ion-justify-content-center">
		<ion-div>{getDayByIndex(getDayIndex(day), 'el', true)}</ion-div>
	</ion-row>
</ion-grid>