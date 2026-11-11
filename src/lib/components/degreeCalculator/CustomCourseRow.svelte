<script lang="ts">
	import * as allIonicIcons from 'ionicons/icons';
	import { t } from '$lib/i18n';
	import { isFailing } from './degreeGrade';
	import type { CustomCourse } from './customCourses';

	interface Props {
		course: CustomCourse;
		deleteCustomCourse: (id: number) => void;
		onGrade: (course: CustomCourse) => void;
		onClear: (course: CustomCourse) => void;
		onCoefficient: (course: CustomCourse) => void;
		onTitle: (course: CustomCourse) => void;
	}

	let {
		course = $bindable(),
		deleteCustomCourse,
		onGrade,
		onClear,
		onCoefficient,
		onTitle
	}: Props = $props();

	function setTitle(value: unknown) {
		course.title = String(value ?? '');
		onTitle(course);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="course-box">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->

	<ion-icon
		onclick={() => deleteCustomCourse(course.id)}
		size="small"
		class="icons"
		icon={allIonicIcons.removeCircle}
	></ion-icon>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<ion-input
		id={`course-title-${course.id}`}
		class="course-name ion-padding-end"
		placeholder={$t('customCourse.title')}
		value={course.title}
		onfocus={() => setTitle('')}
		onionInput={(e) => setTitle(e.target.value)}
	></ion-input>

	<input
		id={`ects-${course.id}`}
		class="ects"
		placeholder={'ECTS'}
		inputmode={'numeric'}
		onfocus={() => {
			course.coefficient = '';
			onCoefficient(course);
		}}
		bind:value={course.coefficient}
		oninput={() => onCoefficient(course)}
		maxlength="2"
	/>
</div>

<div class="input-box">
	<input
		id={`custom-grade-${course.id}`}
		type="text"
		inputmode="decimal"
		class="inputCustom"
		class:invalid={isFailing(course)}
		name="grade"
		onfocus={() => onClear(course)}
		onclick={() => onClear(course)}
		bind:value={course.grade}
		placeholder="5.00"
		oninput={() => onGrade(course)}
	/>
</div>

<style>
	input {
		max-width: 10em;
	}

	.course-box {
		padding-left: 1em;
		padding-right: 0.5em;
		margin-bottom: 0.3em;
		flex: 3.25; /* Takes 3/4 of the available space */
		display: flex;
		align-items: center;
		justify-content: start;
		gap: 0.5rem;
	}

	.course-name {
		color: var(--app-color-degree-course);
		font-size: 1em;
		text-align: left;
	}

	.icons {
		width: 2rem;
		height: 2rem;
	}

	.input-box {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 0.75; /* Takes 1/8 of the available space */
		color: var(--app-color-degree-custom-input);
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

	.ects {
		margin-top: 0.3em;
		text-align: center;
		border: 0.15em solid var(--app-color-degree-placeholder);
		border-radius: 0.8em;
		font-size: 0.8em;
		width: 8em;
		height: 2.5em;
		box-sizing: border-box;
		outline: none;
		background-color: #0000;
		color: var(--app-color-degree-custom-input);
	}
</style>
