<script lang="ts">
	import Grades from '$lib/components/grades/grades.svelte';
	// @ts-ignore
	import 'js-circle-progress'
	import { neoUniversisGet } from '$lib/dataService';
	import Stats from '$lib/components/grades/statsCard.svelte';
	import {coursesPerSemester} from '$lib/functions/coursePerSemester/coursesPerSemester';
	import Chips from '$lib/components/grades/chips.svelte';
	import { Capacitor } from '@capacitor/core';
	import GradesSkeleton from '$components/grades/gradesSkeleton.svelte';
	import Flipper from "$components/shared/Flipper.svelte";
	import { flipped } from "./flipstore"; 
	import { averagesPerSemester } from '$lib/functions/gradeAverages/averagesPerSemester';
	import { writable } from 'svelte/store';
	import Fuse from 'fuse.js';
	import Card from '$components/degreeCalculator/card.svelte';      


	let courseBySemester = writable([]);
	let filteredSubjects = writable([]);

	const fuseOptions = {
	  keys: ['course', 'courseTitle'],
	  threshold: 0.3,
	};


	let searchQuery = '';
	let subjects = 0;
	let passedSubjects = 0;
	let coursesBySemester = {};
	let subjectsJSON: number | null | undefined;
	/**
	 * @type {string}
	 */
	let semesterId: any;

	/**
	 * @param {{ target: { value: string; }; }} event
	 */
	

	function handleChange(event: { target: { value: string; }; }) {
		searchQuery = event.target.value;
	}

	function flip() {
		$flipped = !$flipped;
	}


	async function getSubjects(subjectsJSON: any) {
		
		coursesBySemester = await coursesPerSemester(subjectsJSON);
		// @ts-ignore
		passedSubjects = subjects.filter((/** @type {{ grade: number; }} */ course) => course.grade*10 >=5);
		
		// @ts-ignore
		subjects = subjects.length;
		// @ts-ignore
		passedSubjects = passedSubjects.length;
	}

	async function gatherGrades(subjectsJSON: any) {


		const courses = await coursesPerSemester(subjectsJSON);
	  	const semesterAverage = await averagesPerSemester(subjectsJSON);

		 // keep semester id, average, and courses in an array
		 const semesters = Object.keys(courses).map((key) => {
		   return {
			 semesterId: key,
			 average: semesterAverage[key] ? semesterAverage[key] : '-',
			 courses: courses[key],
		   };
		 });

		 semesters.sort((a, b) => a.semesterId - b.semesterId);

		 courseBySemester.set(semesters);

		 return semesters;
	}

	async function gatherData() {
		subjects = (await neoUniversisGet('students/me/courses?$top=-1',{lifetime: 600})).value;

		subjectsJSON = subjects;

		await getSubjects(subjectsJSON);
		await gatherGrades(subjectsJSON);
	}


	// Filter the results based on the searchQuery
  
	$: {

		const courses = $courseBySemester;
		if (searchQuery.length === 0) {
		  filteredSubjects.set(courses);
		} else {
		  const subjects = courses.reduce((acc, curr) => acc.concat(curr.courses), []);
		  const fuse = new Fuse(subjects, fuseOptions);
		  const searchResults = fuse.search(searchQuery);

		  const filtered = courses.map((semester) => {
			  return {
				  ...semester,
				  courses: searchResults.filter(result =>
					  semester.courses.some(course => course.course === result.item.course)
				  ).map(result => result.item),
			  };
		  });
		  filteredSubjects.set(filtered);
}

}




</script>

<ion-tab tab="grades">
  <ion-header collapse="condense" mode="ios">
    <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
      <ion-title class="ion-padding-vertical" size="large">Πρόοδος</ion-title>
    

      <ion-searchbar class="searchbar" debounce={500} on:ionInput={handleChange} inputmode="text" show-clear-button="always" placeholder="Αναζήτηση Μαθημάτων"></ion-searchbar>
      
      
      <Chips coursesBySemester={coursesBySemester} semesterId={semesterId} />
    </ion-toolbar>
  </ion-header>

 <!-- Show skeleton while loading -->
 <ion-content fullscreen={true}>
	{#await gatherData()}
		<ion-progress-bar type="indeterminate"/>
		<GradesSkeleton/>
	{:then}
	<!-- Show content after loading is completed -->
	<Flipper reactToHeight bind:flipped={$flipped}>
        <Stats flip={flip} searchQuery = {searchQuery} subjects={subjects} passedSubjects={passedSubjects} subjectsJSON = {subjectsJSON} slot="front" />
        <Card flip={flip} slot="back"/>
    </Flipper>
		
		
	  
		<Grades semesterId = {semesterId} searchQuery = {searchQuery} filteredSubjects = {filteredSubjects} />

		{:catch error}
        <p>Παρουσιάστηκε σφάλμα :&#40;</p>
		<p>{error.message}</p>
	{/await}
</ion-content>

</ion-tab>

<style>


	ion-content {
	--padding-end: 0.6rem;
	--padding-start: 0.6rem;
}

</style>

