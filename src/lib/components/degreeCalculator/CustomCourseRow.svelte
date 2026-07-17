<script lang="ts">
	import * as allIonicIcons from 'ionicons/icons';
	import { t } from '$lib/i18n';
	import { isFailing } from './degreeGrade';
	import type { CustomCourse } from './customCourses';

	export let course: CustomCourse;
	export let deleteCustomCourse: (id: number) => void;
	export let onGrade: (course: CustomCourse) => void;
	export let onClear: (course: CustomCourse) => void;
	export let onCoefficient: (course: CustomCourse) => void;
	export let onTitle: (course: CustomCourse) => void;

	function setTitle(value: unknown) {
		course.title = String(value ?? '');
		onTitle(course);
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="course-box">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->

	<ion-icon
		on:click={() => deleteCustomCourse(course.id)}
		size="small"
		class="icons"
		icon={allIonicIcons.removeCircle}
	/>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<ion-input
		id={`course-title-${course.id}`}
		class="course-name ion-padding-end"
		placeholder={$t('customCourse.title')}
		value={course.title}
		on:focus={() => setTitle('')}
		on:ionInput={(e) => setTitle(e.target.value)}
	/>

	<input
		id={`ects-${course.id}`}
		class="ects"
		placeholder={'ECTS'}
		inputmode={'numeric'}
		on:focus={() => {
			course.coefficient = '';
			onCoefficient(course);
		}}
		bind:value={course.coefficient}
		on:input={() => onCoefficient(course)}
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
		on:focus={() => onClear(course)}
		on:click={() => onClear(course)}
		bind:value={course.grade}
		placeholder="5.00"
		on:input={() => onGrade(course)}
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
