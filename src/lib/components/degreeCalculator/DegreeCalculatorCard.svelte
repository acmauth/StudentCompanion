<script lang="ts">
	import { t } from '$lib/i18n';
	import GradeSummary from './GradeSummary.svelte';
	import UnpassedCourseRow from './UnpassedCourseRow.svelte';
	import CustomCourseRow from './CustomCourseRow.svelte';
	import Chip from '$components/shared/Chips.svelte';
	import * as allIonicIcons from 'ionicons/icons';
	import { fade } from 'svelte/transition';
	import { get } from 'svelte/store';
	import { customCourses } from './customCourses';
	import type { CustomCourse } from './customCourses';
	import { fetchDegreeData } from './fetchDegreeData';
	import type { UnpassedCourse } from './fetchDegreeData';
	import {
		applyGradeInput,
		clearGradeInput,
		computeDegreeGrade,
		isFailing,
		normalizeCoefficient
	} from './degreeGrade';
	import type { PassedSums } from './degreeGrade';

	// Optional: the standalone /degreeCalculator route renders the card with
	// nothing to flip back to.
	export let flip: () => void = () => {};

	// Placeholder rows standing in for the courses while they load.
	const SKELETON_ROWS = Array.from({ length: 4 });
	const SKELETON_TITLE = 'ΜΑΘΗΜΑ ΧΧΧΧΧΧ ΧΧΧΧΧΧΧΧ ΧΧΧΧΧΧ';
	const SKELETON_GRADE = {
		based: { value: 0, stringed: '0.00' },
		simple: { value: 0, stringed: '0.00' }
	};

	let unpassedCourses: UnpassedCourse[] = [];
	let passedSums: PassedSums = {
		based: { grade_sum: 0, coefficient: 0 },
		simple: { grade_sum: 0, passed: 0 }
	};


	let nextId = get(customCourses).reduce((max, course) => Math.max(max, course.id + 1), 0);

	async function load() {
		const data = await fetchDegreeData();
		passedSums = data.passedSums;
		unpassedCourses = data.unpassedCourses;
	}

	$: degreeGrade = computeDegreeGrade(passedSums, [...unpassedCourses, ...$customCourses]);

	function onUnpassedGrade(course: UnpassedCourse) {
		applyGradeInput(course);
		unpassedCourses = unpassedCourses;
	}

	function onUnpassedClear(course: UnpassedCourse) {
		clearGradeInput(course);
		unpassedCourses = unpassedCourses;
	}

	function onCustomGrade(course: CustomCourse) {
		applyGradeInput(course);
		// Reassign through the store so the change is persisted and picked up.
		customCourses.update((courses) => courses);
	}

	function onCustomClear(course: CustomCourse) {
		clearGradeInput(course);
		customCourses.update((courses) => courses);
	}

	function onCustomCoefficient(course: CustomCourse) {
		course.coefficient = normalizeCoefficient(course.coefficient);
		customCourses.update((courses) => courses);
	}

	function onCustomTitle() {
		customCourses.update((courses) => courses);
	}

	function addCourse() {
		customCourses.update((courses) => [
			...courses,
			{ id: nextId++, title: '', coefficient: '', grade: '', lastGrade: '', gradeNumber: null }
		]);
	}

	function deleteCustomCourse(id: number) {
		customCourses.update((courses) => courses.filter((course) => course.id !== Number(id)));
	}
</script>

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

<ion-card class="ion-padding-vertical">
	<ion-card-title>{$t('progress.average_prediction_full')}</ion-card-title>
	<ion-card-subtitle>{$t('progress.average_prediction_desc')}</ion-card-subtitle>

	{#await load()}
		{#each SKELETON_ROWS as _}
			<UnpassedCourseRow course_title={SKELETON_TITLE} course_semester_id={-1} course_semester_name="" />
		{/each}
		<GradeSummary degree_grade={SKELETON_GRADE} />
	{:then}
		<div class="container">
			<div class="scrollable-content ion-padding-vertical">
				{#each unpassedCourses as course (course.id)}
					<div class="courses-box">
						<UnpassedCourseRow
							course_title={course.title}
							course_semester_id={course.semester_id}
							course_semester_name={course.semester_name}
						/>

						<div class="input-box">
							<input
								type="text"
								inputmode="decimal"
								id={`grade-${course.id}`}
								class="inputCustom"
								class:invalid={isFailing(course)}
								bind:value={course.grade}
								on:click={() => onUnpassedClear(course)}
								placeholder="5.00"
								on:input={() => onUnpassedGrade(course)}
							/>
						</div>
					</div>
				{/each}

				{#each $customCourses as course (course.id)}
					<div transition:fade class="custom-courses-box">
						<!-- Render new custom courses -->
						<CustomCourseRow
							{course}
							{deleteCustomCourse}
							onGrade={onCustomGrade}
							onClear={onCustomClear}
							onCoefficient={onCustomCoefficient}
							onTitle={onCustomTitle}
						/>
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

				<GradeSummary degree_grade={degreeGrade} />

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
		flex-shrink: 0;
	}

	ion-card {
		display: flex;
		flex-direction: column;
		z-index: 1;
		overflow: hidden; 
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

	.inputCustom.invalid {
		border-color: red;
	}

	::placeholder {
		color: var(--app-color-degree-placeholder);
	}
</style>
