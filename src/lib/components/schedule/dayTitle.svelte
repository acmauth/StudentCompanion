<script lang="ts">
	import {activeDay} from "./activeDay";
	import * as allIonicIcons from 'ionicons/icons';
	export let day: string;

	function setActiveDay(event: Event) {
    console.log("hi");

    // Reset all icons to ellipseOutline
    const allIcons = document.querySelectorAll('ion-icon');
    allIcons.forEach(icon => {
      icon.icon = allIonicIcons.ellipseOutline;
    });

    // Use the event object to get the clicked element and its parent grid
    const clickedElement = event.target as HTMLElement;
    const gridElement = clickedElement.closest('ion-grid');

    if (gridElement) {
      // Find the ion-icon within the clicked grid and update its icon
      const iconElement = gridElement.querySelector('ion-icon');
      if (iconElement) {
        iconElement.icon = allIonicIcons.ellipse;
      }
    }
  }

</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<ion-grid id="{day}" on:click={setActiveDay}>
	<ion-row class="ion-align-items-center ion-justify-content-center" style="padding: 3%; font-size: 200%">
	  <ion-icon id="icon" icon={allIonicIcons.ellipseOutline}/>
	</ion-row >
	<ion-row class="ion-align-items-center ion-justify-content-center">
	  <ion-div >{day}</ion-div>
	</ion-row>
</ion-grid>