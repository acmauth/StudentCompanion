<script lang="ts">
	import ErrorLandingCard from '$components/errorLanding/ErrorLandingCard.svelte';
	import GradesSkeleton from './GradesSkeleton.svelte';
	import Flipper from '$components/shared/Flipper.svelte';
	import SemesterSection from './SemesterSection.svelte';
	import SemesterChips from './SemesterChips.svelte';
	import DegreeCalculatorCard from '$components/degreeCalculator/DegreeCalculatorCard.svelte';
	import StatsCard from './StatsCard.svelte';
	import 'js-circle-progress';
	import { neoUniversisGet } from '$lib/dataService';
	import { coursesPerSemester } from '$lib/functions/coursePerSemester/coursesPerSemester';
	import { flipped } from './helpers';
	import { averagesPerSemester } from '$lib/functions/gradeAverages/averagesPerSemester';
	import type { course } from '$lib/types/courseType';
	import type { Registration, SemesterGroup } from '$types/grades';
	import Fuse from 'fuse.js';
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';

	// Fix for flipper covering content
	onMount(async () => {
		// Making sure the flipper is not flipped when the page is loaded
		// This is because the flipper maintains it's state when loaded, even when the flipper component is in an invalid state
		// Due to the following components not having loaded fully yet. So with the onMount we can reset the state.
		// Note for future reference: If we want it to retain it's flipped state, we can do a dual assignment to trigger the store update.
		// So setting it to ~flipped and then flipped again, will trigger the store update.
		$flipped = false;
	});

	const fuseOptions = {
		keys: ['course', 'courseTitle'],
		threshold: 0.3
	};

	// Variables regarding grades and subjects
	let semesterGroups: SemesterGroup[] = [];
	let filteredSubjects: SemesterGroup[] = [];
	let registrationsInDegree: Registration[] = [];
	let searchQuery = '';
	let subjects = 0;
	let passedSubjects = 0;
	let coursesBySemester: { [key: string]: course[] } = {};
	let subjectsJSON: course[] = [];

	// Search
	function handleChange(event: { target: { value: string } }) {
		searchQuery = event.target.value;
	}

	// Flipper toggle
	function flip() {
		$flipped = !$flipped;
	}

	async function getSubjects(courses: course[]) {
		coursesBySemester = await coursesPerSemester(courses);
		const passed = courses
			.filter((course) => course.grade * 10 >= 5)
			.filter((course) => course.parentCourse == null);

		subjects = courses.length;
		passedSubjects = passed.length;
	}

	async function gatherGrades(subjectsJSON: course[]) {
		const courses = await coursesPerSemester(subjectsJSON);
		const semesterAverage = await averagesPerSemester(subjectsJSON);

		// keep semester id, average, and courses in an array
		const semesters: SemesterGroup[] = Object.keys(courses).map((key) => {
			return {
				semesterId: key,
				average: semesterAverage[key] ? semesterAverage[key] : '-',
				courses: courses[key]
			};
		});

		semesters.sort((a, b) => Number(a.semesterId) - Number(b.semesterId));

		semesterGroups = semesters;
	}

	async function gatherProgressionData() {
		const registrationOptions =
			'$select=id,semester,classes&$expand=classes($select=id,finalGrade,coefficient,isPassed,course;$filter=isPassed eq 1)&$orderBy=semester&$top=-1';
		const allRegistrations: Registration[] = (
			await neoUniversisGet(`students/me/registrations?${registrationOptions}`, { lifetime: 1200 })
		).value;

		const calculateGradeOptions =
			'$select=id,course,calculateGrade,isPassed,courseTitle&$filter=calculateGrade eq 0,isPassed eq 1&$top=-1';
		const nonCalculatedGrades: { id: string; course: string; calculateGrade: 0; isPassed: 1 }[] = (
			await neoUniversisGet(`students/me/courses?${calculateGradeOptions}`, { lifetime: 1200 })
		).value;

		const disallowedCourses = new Set(nonCalculatedGrades.map((item) => item.course));
		registrationsInDegree = allRegistrations.map((registration) => ({
			...registration,
			classes: registration.classes.filter(
				(classInstance) =>
					!disallowedCourses.has(classInstance.course) && classInstance.isPassed == 1
			)
		}));
	}

	async function gatherData() {
		subjectsJSON = (await neoUniversisGet('students/me/courses?$top=-1', { lifetime: 600 })).value;

		await getSubjects(subjectsJSON);
		await gatherGrades(subjectsJSON);
		await gatherProgressionData();
	}

	// Filter the results based on the searchQuery
	$: {
		if (searchQuery.length === 0) {
			filteredSubjects = semesterGroups;
		} else {
			const allCourses = semesterGroups.reduce<course[]>((acc, curr) => acc.concat(curr.courses), []);
			const fuse = new Fuse(allCourses, fuseOptions);
			const searchResults = fuse.search(searchQuery);

			filteredSubjects = semesterGroups.map((semester) => {
				return {
					...semester,
					courses: searchResults
						.filter((result) =>
							semester.courses.some((course) => course.course === result.item.course)
						)
						.map((result) => result.item)
				};
			});
		}
	}
</script>

<!-- Show skeleton while loading -->
<ion-page>
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
					<SemesterChips {coursesBySemester} />
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
					<StatsCard
						{flip}
						{subjects}
						{passedSubjects}
						{subjectsJSON}
						{registrationsInDegree}
						slot="front"
					/>
					<DegreeCalculatorCard {flip} slot="back" />
				</Flipper>
			{/if}

			{#each filteredSubjects as semester (semester.semesterId)}
				{#if semester.courses.length > 0}
					<SemesterSection
						semesterAverage={semester.average}
						semesterId={semester.semesterId}
						courses={semester.courses}
						semesterName={semester.courses[0].semester.name}
					/>
				{/if}
			{/each}
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
