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
	import { next } from 'cheerio/lib/api/traversing.js';
	import { fade } from 'svelte/transition';
	import { courseAdded, customCourses } from './courseStore.ts';
	import { get } from 'svelte/store';
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

	// Define the degree_grade object to store the average grades for the custom courses
	let degree_grade = { based: { value: 0, stringed: '' }, simple: { value: 0, stringed: '' } };

	// Define the sums object to store the sum of the grades and coefficients for the custom courses
	let sums = { based: { grade_sum: 0, coefficient: 0 }, simple: { grade_sum: 0, passed: 0 } };

	let not_passed_all_courses = false;

	let nextId = 0; // Define a separate variable to track IDs

	async function universis() {
		not_passed_all_courses = await main(unpassed_courses, sums, degree_grade);
	}

	/** @param { { target: { value: string; }; } } element */
	function clickInput(element: { target: { value: string } }) {
		element.target.value = '';
		inputUpdate(unpassed_courses, sums, degree_grade, $customCourses);
		degree_grade = degree_grade;
	}

	function gradeInput(customCourse = null) {
		$customCourses.forEach((course) => {
			if (course.coefficient) {
				// Ensure it's a number and within range
				course.coefficient = course.coefficient
					.toString()
					.replace(/\D/g, '') // Remove non-numeric characters
					.slice(0, 2); // Limit to 2 digits
			}
		});

		inputUpdate(unpassed_courses, sums, degree_grade, $customCourses);
		degree_grade = degree_grade;
	}

	// Handle the input change for the custom courses
	function addCourse() {
		// Add new custom course and reassign as a new array
		customCourses.update((courses) => [
			...courses,
			{ id: nextId++, title: '', coefficient: '', grade: '' }
		]);
		courseAdded.update((n) => n + 1);
	}

	const deleteCustomCourse = (id) => {
		customCourses.update((courses) => courses.filter((course) => course.id !== Number(id)));
		inputUpdate(unpassed_courses, sums, degree_grade, get(customCourses));
		degree_grade = degree_grade;
	};
</script>

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

<ion-card class="ion-padding-vertical">
	<ion-card-title>{$t('progress.average_prediction_full')}</ion-card-title>
	<ion-card-subtitle>{$t('progress.average_prediction_desc')}</ion-card-subtitle>

	{#await universis()}
		<CoursesSkeleton />
		<!-- svelte-ignore a11y-no-static-element-interactions -->
	{:then}
		<div class="container">
			<div class="scrollable-content ion-padding-vertical">
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
									on:input={() => gradeInput()}
								/>
							</div>
						</div>
					{/each}
				{/if}

				{#each $customCourses as course, index}
					<div transition:fade class="custom-courses-box">
						<!-- Render new custom courses -->
						<CustomCourse {clickInput} {gradeInput} {course} {deleteCustomCourse} />
					</div>
				{/each}
			</div>

			<div class="columnFlex">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div on:click={addCourse} class="ion-padding addCourse">
					<ion-icon class="icons" icon={allIonicIcons.addCircle} />
					<ion-text class="course-name ion-padding-end">{$t('customCourse.title')}</ion-text>
				</div>

				<AvGrades {degree_grade} />

				<Chip chipIcon={allIonicIcons.cellular} text={$t('progress.title')} {flip} />
			</div>
		</div>
	{/await}
</ion-card>

<style>
	.container {
		display: flex;
		flex-direction: column;
		max-height: 90vh; /* Ensure the container takes full viewport height */
	}

	.scrollable-content {
		flex-grow: 1; /* Take up the remaining space */
		overflow-y: auto; /* Enable scrolling */
		padding: 10px;
		max-height: 35vh; /* Fill the available height */
	}

	.columnFlex {
		flex-shrink: 0; /* Prevent this section from shrinking */
	}

	ion-card {
		display: flex;
		flex-direction: column;
		z-index: 1;
		overflow: hidden; /* Prevent card from overflowing */
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

	.icons {
		width: 1.5rem;
		height: 1.5rem;
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
		align-items: center;
	}

	.addCourse {
		max-width: fit-content;
		margin-top: 1.5em;
		display: flex;
		align-items: center;
		border: 1px dashed var(--app-color-degree-placeholder);
		border-radius: 5em;
		height: 3em;
		gap: 0.5rem;
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
</style>
