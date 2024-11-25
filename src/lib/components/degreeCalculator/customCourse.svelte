<script>
	import * as allIonicIcons from 'ionicons/icons';
	export let clickInput;
	export let gradeInput;
	export let handleInputChange;
	export let customCourses;
	export let id;
	export let deleteCustomCourse;
</script>

<div class="course-box">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<ion-button
		on:click={deleteCustomCourse}
		class="ion-padding-end"
		color="danger"
		size="small"
		fill="solid"
	>
		<ion-icon size="small" icon={allIonicIcons.trash} slot="icon-only" />
	</ion-button>
	<ion-input
		class="course-name ion-padding-end"
		placeholder="Έξτρα μάθημα"
		{id}
		value={customCourses[id].title}
		on:ionInput={(e) => handleInputChange(e, 'title', id)}
	/>
	<ion-input
		class="course-name"
		placeholder="ECTS"
		inputmode={'numeric'}
		{id}
		value={customCourses[id].ects}
		on:ionInput={(e) => handleInputChange(e, 'ects', id)}
	/>
</div>

<div class="input-box">
	<input
		type="text"
		inputmode="decimal"
		{id}
		class="inputCustom"
		on:click={clickInput}
		placeholder="5.00"
		on:input={gradeInput}
		bind:value={customCourses[id].grade}
		on:input={(e) => handleInputChange(e, 'grade', id)}
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
	}

	.course-name {
		color: var(--app-color-degree-course);
		font-size: 1em;
		text-align: left;
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
</style>
