<script lang="ts">
	//@ts-nocheck
	import { main } from '../../functions/degreeCalculator/main.js';
	import { inputUpdate } from '../../functions/degreeCalculator/inputUpdate.js';
	import { t } from '$lib/i18n';

	import CoursesSkeleton from '$components/degreeCalculator/coursesSkeleton.svelte';
	import AvGrades from '$components/degreeCalculator/avGrades.svelte';
	import Course from '$components/degreeCalculator/course.svelte';
	import Chip from '$components/shared/Chips.svelte';
	import * as allIonicIcons from 'ionicons/icons';
	import CustomCourse from './customCourse.svelte';
	import { icon } from 'leaflet';

	export let flip;

	let unpassed_courses: {
		title: string;
		id: string;
		semester_id: number;
		semester_name: string;
		grade: number;
		input_grade: string;
		coefficient: number;
	}[] = [];

	let degree_grade = { based: { value: 0, stringed: '' }, simple: { value: 0, stringed: '' } };

	let sums = { based: { grade_sum: 0, coefficient: 0 }, simple: { grade_sum: 0, passed: 0 } };

	let not_passed_all_courses = false;

	let customCourses = [
		{ id: 0, title: '', ects: '', grade: '' } // Initialize with the first empty course
	];

	async function universis() {
		not_passed_all_courses = await main(unpassed_courses, sums, degree_grade);
	}

	/** @param { { target: { value: string; }; } } element */
	function clickInput(element: { target: { value: string } }) {
		element.target.value = '';
		inputUpdate(unpassed_courses, sums, degree_grade);
		degree_grade = degree_grade;
	}

	function gradeInput() {
		inputUpdate(unpassed_courses, sums, degree_grade);
		degree_grade = degree_grade;
	}

	// Handle the input change for the custom courses
	function handleInputChange(event: Event, field: 'title' | 'ects' | 'grade', id?: number) {
		const value = (event.target as HTMLInputElement).value;

		// If the 'id' is provided (i.e., for updating an existing course)
		if (id !== undefined) {
			// Find the course by its ID and update the corresponding field
			const courseIndex = customCourses.findIndex((course) => course.id === id);
			if (courseIndex !== -1) {
				customCourses[courseIndex][field] = value; // Update the correct course field
			}

			// If all fields are filled in `customCourses`, add a new course
			if (
				customCourses[courseIndex].title &&
				customCourses[courseIndex].ects &&
				customCourses[courseIndex].grade
			) {
				// Generate a new ID for the new course
				const newId = customCourses.length; // Create a unique ID based on the current length
				// Push a new course with the generated ID and the input data
				customCourses.push({ title: '', ects: '', grade: '', id: newId });
			}
		}
	}

	const deleteCustomCourse = (event) => {
		// Get the ID of the course to be deleted
		const id = Number(event.target.id); // Ensure the ID is a number
		// Filter out the course with the given ID and assign the new array to `customCourses`
		customCourses = customCourses.filter((course) => course.id !== id);
	};
</script>

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

<ion-card style="overflow-y: auto;" class="ion-padding-vertical">
	<ion-card-title>{$t('progress.average_prediction_full')}</ion-card-title>
	<ion-card-subtitle>{$t('progress.average_prediction_desc')}</ion-card-subtitle>

	{#await universis()}
		<CoursesSkeleton />
	{:then}
		{#if not_passed_all_courses}
			{#each unpassed_courses as course}
				<div class="courses-box">
					<Course
						course_title={course.title}
						course_semester_id={course.semester_id}
						course_semester_name={course.semester_name}
					/>

					<div class="input-box">
						<input
							type="text"
							inputmode="decimal"
							id={course.id}
							class="inputCustom"
							on:click={clickInput}
							placeholder="5.00"
							on:input={gradeInput}
						/>
					</div>
				</div>
			{/each}
		{/if}

		{#each customCourses as course, index}
			<div class="custom-courses-box">
				<!-- Render new custom courses -->
				<CustomCourse
					{clickInput}
					{gradeInput}
					{handleInputChange}
					{customCourses}
					id={course.id}
					{deleteCustomCourse}
				/>
			</div>
		{/each}

		<!-- <div class="ion-padding actions">
			<ion-button class="ion-padding" size="small" fill="solid" shape="round">
				<ion-icon icon={allIonicIcons.addOutline} slot="icon-only" />
			</ion-button>
			<ion-button class="ion-padding" color="danger" size="small" fill="solid" shape="round">
				<ion-icon icon={allIonicIcons.trashBin} slot="icon-only" />
			</ion-button>
		</div> -->

		<div class="columnFlex">
			<AvGrades {degree_grade} />

			<Chip chipIcon={allIonicIcons.cellular} text={$t('progress.title')} {flip} />
		</div>
	{/await}
</ion-card>

<style>
	ion-card {
		max-height: 80vh; /* Limit the height to 80% of the viewport height */
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	ion-card-title {
		font-weight: 550;
		margin-top: 1.5rem;
		text-align: center;
		color: var(--app-color-primary-dark);
	}

	ion-card-subtitle {
		text-align: center;
		text-transform: none;
		color: var(--app-color-degree-description);
		font-weight: 500;
		margin-top: 0.3rem;
		margin-bottom: 2.5rem;
		margin-inline: 12%;
	}

	.columnFlex {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.input-box {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 0.75; /* Takes 1/8 of the available space */
		color: var(--app-color-degree-custom-input);
	}

	.courses-box {
		margin-bottom: 0.3m;
		display: flex;
	}

	.custom-courses-box {
		margin-bottom: 0.3m;
		display: flex;
	}

	.inputCustom {
		text-align: center;
		border: 0.15em solid var(--app-color-degree-placeholder);
		border-radius: 0.8em;
		font-size: 0.7em;
		font-weight: bold;
		width: 5em;
		height: 2.5em;
		box-sizing: border-box;
		outline: none;
		background-color: #0000;
	}

	::placeholder {
		color: var(--app-color-degree-placeholder);
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}
</style>
