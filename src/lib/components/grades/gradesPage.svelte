<script lang="ts">
	import ErrorLandingCard from '$components/errorLanding/ErrorLandingCard.svelte';
	import { Capacitor } from '@capacitor/core';
	import GradesSkeleton from './gradesSkeleton.svelte';
	import Flipper from '$components/shared/Flipper.svelte';
	import Grades from '$lib/components/grades/grades.svelte';
	import 'js-circle-progress';
	import Chips from '$lib/components/grades/chips.svelte';
	import DegreeCalculatorCard from '$components/degreeCalculator/card.svelte';
	import Stats from '$lib/components/grades/statsCard.svelte';
	import 'js-circle-progress';
	import { neoUniversisGet } from '$lib/dataService';
	import { coursesPerSemester } from '$lib/functions/coursePerSemester/coursesPerSemester';
	import { flipped } from './flipstore';
	import { averagesPerSemester } from '$lib/functions/gradeAverages/averagesPerSemester';
	import { writable } from 'svelte/store';
	import Fuse from 'fuse.js';
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';
	import { course } from '$types/courseType';

	// Fix for flipper covering content
	onMount(async () => {
		// Making sure the flipper is not flipped when the page is loaded
		// This is because the flipper maintains it's state when loaded, even when the flipper component is in an invalid state
		// Due to the following components not having loaded fully yet. So with the onMount we can reset the state.
		// Note for future reference: If we want it to retain it's flipped state, we can do a dual assignment to trigger the store update.
		// So setting it to ~flipped and then flipped again, will trigger the store update.
		$flipped = false;
	});

	let courseBySemester = writable();
	let filteredSubjects = writable();

	const fuseOptions = {
		keys: ['course', 'courseTitle'],
		threshold: 0.3
	};

	// Variables regarding grades and subjects
	let searchQuery = '';
	let subjects: any = 0;
	let passedSubjects: any = 0;
	let coursesBySemester = {};
	let subjectsJSON: number | null | undefined;

	/**
	 * @type {string}
	 */
	let semesterId: any;

	/**
	 * @param {CustomEvent} event
	 */

	// Search
	function handleChange(event: CustomEvent) {
		searchQuery = event.detail.value ?? '';
	}

	// Flipper toggle
	function flip() {
		$flipped = !$flipped;
	}

	async function getSubjects(subjectsJSON: any) {
		coursesBySemester = await coursesPerSemester(subjectsJSON);

		passedSubjects = subjects

			.filter((/** @type {{ grade: number; }} */ course: course) => course.grade * 10 >= 5)
			.filter((course: { parentCourse: string | null }) => course.parentCourse === null);

		subjects = subjects.length;

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

		semesters.sort((a, b) => Number(a.semesterId) - Number(b.semesterId));

		courseBySemester.set(semesters);

		return semesters;
	}

	async function gatherData() {
		subjects = (await neoUniversisGet('students/me/courses?$top=-1', { lifetime: 600 })).value;

		subjectsJSON = subjects;

		await getSubjects(subjectsJSON);
		await gatherGrades(subjectsJSON);
	}

	// Filter the results based on the searchQuery

	$: {
		const courses: any = $courseBySemester;
		if (searchQuery.length === 0) {
			filteredSubjects.set(courses);
		} else {
			const subjects = courses.reduce(
				(acc: string | any[], curr: { courses: any }) => acc.concat(curr.courses),
				[]
			);
			const fuse = new Fuse<course>(subjects, fuseOptions);
			const searchResults = fuse.search(searchQuery);

			const filtered = courses.map((semester: { courses: any[] }) => {
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
<ion-content fullscreen={true}>
	<ion-header collapse="condense" mode="ios">
		<ion-toolbar mode="md">
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
		<ion-progress-bar type="indeterminate" />
		<GradesSkeleton />
	{:then}
		<!-- Show content after loading is completed -->

		{#if !searchQuery.length}
			<Flipper reactToHeight bind:flipped={$flipped}>
				<Stats
					{flip}
					{searchQuery}
					{subjects}
					{passedSubjects}
					{subjectsJSON}
					slot="front"
				/>
				<DegreeCalculatorCard {flip} slot="back" />
			</Flipper>
		{/if}

		<Grades {semesterId} {searchQuery} {filteredSubjects} />
	{:catch error}
		<ErrorLandingCard errorMsg={error.message} />
	{/await}
</ion-content>

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
