<script>
	import Grades from '$lib/components/grades/grades.svelte';
	import * as allIonicIcons from 'ionicons/icons';
	import  courseBySemester  from '$lib/components/grades/grades.svelte';

	function handleChange(event) {
		console.log(event.target.value);
		console.log(Object.keys(courseBySemester));
	}


</script>

<ion-page style="overflow-y: auto;">

  <ion-nav-title>
			<ion-item-divider sticky>
				<ion-searchbar on:ionInput={handleChange} inputmode="text" show-clear-button="always" placeholder="Αναζήτηση Μαθημάτων"></ion-searchbar>
			</ion-item-divider>
	</ion-nav-title>
		<Grades  />

</ion-page>
