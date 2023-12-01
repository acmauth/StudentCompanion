<script>
	import Grades from '$lib/components/grades/grades.svelte';
	// @ts-ignore
	import * as allIonicIcons from 'ionicons/icons';
	// @ts-ignore
	import courseBySemester from '$lib/components/grades/grades.svelte';
	import 'js-circle-progress';
	import { onMount } from 'svelte';
	import { universisGet } from '$lib/dataService';
	import Stats from '$lib/components/grades/statsCard.svelte';

	let searchQuery = '';
	let subjects = 0;
	let passedSubjects = 0;

	/**
	 * @param {{ target: { value: string; }; }} event
	 */

	function handleChange(event) {
		searchQuery = event.target.value;
	}

	onMount(async () => {
		subjects = (await universisGet('students/me/courses?$top=-1')).value;
		// @ts-ignore
		passedSubjects = subjects.filter(
			(/** @type {{ grade: number; }} */ course) => course.grade * 10 >= 5
		);

		// @ts-ignore
		subjects = subjects.length;
		// @ts-ignore
		passedSubjects = passedSubjects.length;
	});
</script>

<ion-tab tab="grades">
<ion-content style="overflow-y: auto;">
	<ion-nav-title>
		<ion-item-divider sticky>
			<ion-searchbar on:ionInput={handleChange} inputmode="text" show-clear-button="always" placeholder="Αναζήτηση Μαθημάτων"></ion-searchbar>
		</ion-item-divider>
</ion-nav-title>

	<Stats subjects={subjects} passedSubjects={passedSubjects} />
  
		<Grades searchQuery = {searchQuery}  />
  

		<Grades {searchQuery} />
	</ion-content>
</ion-tab>
