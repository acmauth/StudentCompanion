<script lang="ts">
	import { onMount } from "svelte";
	import {activeDay} from "./activeDay";
	import * as allIonicIcons from 'ionicons/icons';
	export let day: string;

	function setActiveDay(event: Event) {

		const allIcons = document.querySelectorAll('ion-icon');
		allIcons.forEach(icon => {
		icon.icon = allIonicIcons.ellipseOutline;
		});

		const clickedElement = event.target as HTMLElement;
		const gridElement = clickedElement.closest('ion-grid');

		if (gridElement) {
			activeDay.set(gridElement.id)

			const iconElement = gridElement.querySelector('ion-icon');
			if (iconElement) {
				iconElement.icon = allIonicIcons.ellipse;
			}
		}
  	}

	onMount(async () => {
		if(day.toLowerCase() == $activeDay)
		{	
			const el = document.getElementById('icon');
			el.icon = allIonicIcons.ellipse;
		}
	})

</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<ion-grid id="{day.toLowerCase()}" on:click={setActiveDay}>
	<ion-row class="ion-align-items-center ion-justify-content-center" style="padding: 3%; font-size: 200%">
	  <ion-icon id="icon" icon={allIonicIcons.ellipseOutline}/>
	</ion-row >
	<ion-row class="ion-align-items-center ion-justify-content-center">
	  <ion-div >{day}</ion-div>
	</ion-row>
</ion-grid>