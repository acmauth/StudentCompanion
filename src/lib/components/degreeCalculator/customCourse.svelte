<script>
	import * as allIonicIcons from 'ionicons/icons';
	export let clickInput;
	export let gradeInput;
	export let course;
	export let deleteCustomCourse;
	import { t } from '$lib/i18n';
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
		on:focus={() => (course.title = '')}
		on:ionInput={(e) => (course.title = e.target.value)}
	/>

	<input
		id={`ects-${course.id}`}
		class="ects"
		placeholder={$t('customCourse.coefficient')}
		inputmode={'numeric'}
		on:focus={() => (course.coefficient = '')}
		on:click={clickInput}
		bind:value={course.coefficient}
		on:input={() => gradeInput(course)}
		maxlength="2"
	/>
</div>

<div class="input-box">
	<input
		id={course.id}
		type="text"
		inputmode="decimal"
		class="inputCustom"
		name="grade"
		on:focus={() => (course.grade = '')}
		on:click={clickInput}
		bind:value={course.grade}
		placeholder="5.00"
		on:input={() => gradeInput(course)}
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
