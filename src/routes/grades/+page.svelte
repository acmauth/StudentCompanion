<script>
	import Grades from '$lib/components/grades/grades.svelte';
	import * as allIonicIcons from 'ionicons/icons';
	import  courseBySemester  from '$lib/components/grades/grades.svelte';

let searchQuery = '';

	/**
	 * @param {{ target: { value: string; }; }} event
	 */
	
	function handleChange(event) {
		searchQuery = event.target.value;
	}


</script>

<ion-page style="overflow-y: auto;">
  <ion-nav-title>
			<ion-item-divider sticky>
				<ion-searchbar on:ionInput={handleChange} inputmode="text" show-clear-button="always" placeholder="Αναζήτηση Μαθημάτων"></ion-searchbar>
			</ion-item-divider>
	</ion-nav-title>
			
		
			

		<Grades searchQuery = {searchQuery}  />
  
</ion-page>
