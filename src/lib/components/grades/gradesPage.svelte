<script lang="ts">
  import ErrorLandingCard from "$components/errorLanding/ErrorLandingCard.svelte";
  import GradesSkeleton from "./gradesSkeleton.svelte";
  import Flipper from "$components/shared/Flipper.svelte";
  import Grades from '$lib/components/grades/grades.svelte';
  import Chips from '$lib/components/grades/chips.svelte';
  import DegreeCalculatorCard from '$components/degreeCalculator/card.svelte';
  import Stats from '$lib/components/grades/statsCard.svelte';
  import 'js-circle-progress'
  import { neoUniversisGet } from '$lib/dataService';
  import {coursesPerSemester} from '$lib/functions/coursePerSemester/coursesPerSemester';
  import { flipped } from "./flipstore"; 
  import { averagesPerSemester } from '$lib/functions/gradeAverages/averagesPerSemester';
  import { writable } from 'svelte/store';
  import Fuse from 'fuse.js';
  import { onMount } from 'svelte';
  import { t } from "$lib/i18n";

	

	// Fix for flipper covering content
	onMount(async () => {
		// Making sure the flipper is not flipped when the page is loaded
		// This is because the flipper maintains it's state when loaded, even when the flipper component is in an invalid state
		// Due to the following components not having loaded fully yet. So with the onMount we can reset the state.
		// Note for future reference: If we want it to retain it's flipped state, we can do a dual assignment to trigger the store update.
		// So setting it to ~flipped and then flipped again, will trigger the store update.
		$flipped = false;
	});

	interface Registration {
		id: number;
		semester: number;
		classes: {id: string;finalGrade: number;coefficient: number;isPassed: number;registration: number;course: string}[];
	}

	let courseBySemester = writable([]);
	let filteredSubjects = writable([]);
	let registrationsInDegree: Registration[];

	const fuseOptions = {
		keys: ['course', 'courseTitle'],
		threshold: 0.3
	};

	// Variables regarding grades and subjects
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

	// Search
	function handleChange(event: { target: { value: string } }) {
		searchQuery = event.target.value;
	}

	// Flipper toggle
	function flip() {
		$flipped = !$flipped;
	}

	async function getSubjects(subjectsJSON: any) {
		coursesBySemester = await coursesPerSemester(subjectsJSON);
		// @ts-ignore
		passedSubjects = subjects
			.filter((/** @type {{ grade: number; }} */ course) => course.grade * 10 >= 5)
			.filter(/** @type {{parentCourse: string;}} */ (course) => course.parentCourse === null);

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
				courses: courses[key]
			};
		});

		semesters.sort((a, b) => a.semesterId - b.semesterId);

		courseBySemester.set(semesters);

		return semesters;
	}

	async function gatherProgressionData(){
		const registration_options = "$select=id,semester,classes&$expand=classes($select=id,finalGrade,coefficient,isPassed,course;$filter=isPassed eq 1)&$orderBy=semester&$top=-1"
		const all_registrations: Registration[] = (await neoUniversisGet(`students/me/registrations?${registration_options}`, { lifetime: 1200 })).value

		const calculateGrade_options = "$select=id,course,calculateGrade,isPassed,courseTitle&$calculateGrade eq 0,isPassed eq 1&$top=-1"
		const nonCalculatedGrades: {"id": string;"course": string;"calculateGrade": 0;"isPassed": 1;}[] = (await neoUniversisGet(`students/me/courses?${calculateGrade_options}`, { lifetime: 1200 })).value
		
		const disallowed_courses = new Set(nonCalculatedGrades.map(item => item.course))
		registrationsInDegree = all_registrations.map(registration => ({
			...registration,
			classes: registration.classes.filter(class_instance => !disallowed_courses.has(class_instance.course))
		}))

	}	

	async function gatherData() {
		subjects = (await neoUniversisGet('students/me/courses?$top=-1', { lifetime: 600 })).value;

		subjectsJSON = subjects;

		await getSubjects(subjectsJSON);
		await gatherGrades(subjectsJSON);
		await gatherProgressionData();
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
					courses: searchResults
						.filter((result) =>
							semester.courses.some((course) => course.course === result.item.course)
						)
						.map((result) => result.item)
				};
			});
			filteredSubjects.set(filtered);
		}
	}
</script>

<!-- Show skeleton while loading -->
<ion-page>

<ion-content fullscreen={true}>
	<ion-header collapse="condense" mode="ios">
		<ion-toolbar mode='md'>
			<ion-title class="ion-padding-vertical" size="large">{$t('progress.title')}</ion-title>

			<ion-searchbar
				debounce={500}
				on:ionInput={handleChange}
				inputmode="text"
				show-clear-button="always"
				placeholder={$t('progress.search')}
			/>

			{#if Object.entries(coursesBySemester).length > 0}
				<Chips {coursesBySemester} {semesterId} />
			{/if}
		</ion-toolbar>

	  </ion-header>

	  {#await gatherData()}
		  <ion-progress-bar type="indeterminate"/>
		  <GradesSkeleton/>
	  {:then}
	  <!-- Show content after loading is completed -->
  
	  {#if !searchQuery.length}
		  <Flipper reactToHeight bind:flipped={$flipped}>
			  <Stats flip={flip} searchQuery = {searchQuery} subjects={subjects} passedSubjects={passedSubjects} subjectsJSON = {subjectsJSON} registrationsInDegree={registrationsInDegree} slot="front" />
			  <DegreeCalculatorCard flip={flip} slot="back"/>
		  </Flipper>
	  {/if}
		  
		  
		  
		  <Grades semesterId = {semesterId} searchQuery = {searchQuery} filteredSubjects = {filteredSubjects} />
  
		  {:catch error}
				  <ErrorLandingCard errorMsg={error.message} />
	  {/await}
  </ion-content>
</ion-page>
  
  <style>
  
	  ion-header {
		  position: sticky;
		  top: 0;
		  z-index: 1;
	  }
  
	  ion-content {
	  --padding-end: 0.6rem;
	  --padding-start: 0.6rem;
  }
  
  
  
  
  
  </style>
