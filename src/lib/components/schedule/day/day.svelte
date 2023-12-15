<script lang="ts">
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
</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<ion-segment-button value={day} id="{day.toLowerCase()}" on:click={setActiveDay}>
    <ion-label>{day}</ion-label>
</ion-segment-button>

<style>
    ion-segment-button {
        --border-radius: 50rem;
        --border-style: none;
        /* --indicator-box-shadow: none; */
        --indicator-color: var(--ion-color-primary);
    }

    ion-label {
        border-radius: var(--border-radius);
        overflow: hidden;
        padding: 10px;
    }
</style>