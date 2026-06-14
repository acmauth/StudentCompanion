<script lang="ts">
	import type { course } from '$lib/types/courseType';
	import AppCard from '$shared/AppCard.svelte';
	import * as allIonicIcons from 'ionicons/icons';
	import Course from '$components/courses/coursePage.svelte';
	import CourseRow from './courseRow.svelte';
	import { navController } from '$components/shared/StackedNav';
	import { getSemester } from '$components/courses/getSemester';
	import { t, getLocale } from '$lib/i18n';

	export let filteredSubjects: course[] = [];
	export let semesterId: string;
	export let semesterAverage: string;
	export let semesterName: string;

	let childrenOpen: boolean[] = [];

	function toggleChildren(index: number) {
		childrenOpen[index] = !childrenOpen[index];
	}

	function navigateToCourse(course: course) {
		if (!(course.childCourses && course.childCourses.length > 0))
			navController.push(Course, { id: course.course });
	}
</script>

<span class="scroll" id={semesterId} />

<div class="container">
	{#if filteredSubjects.length > 0}
		<div class="ion-padding-start ion-padding-vertical semester">
			{#if Number(semesterId) <= 24}
				<ion-text class="title"
					><b>{getSemester(semesterId, getLocale())} {$t('progress.semester')}</b
					></ion-text
				>
			{:else}
				<ion-text class="title"><b>{semesterName}</b></ion-text>
			{/if}
			{#if semesterAverage}
				<ion-text class="subtitle"
					>{$t('progress.semesterAverage')}: {semesterAverage}</ion-text
				>
			{:else}
				<ion-text class="subtitle">{$t('progress.semesterAverage')}: -</ion-text>
			{/if}
		</div>

		{#each filteredSubjects as course, index}
			<AppCard id={index} onClick={() => navigateToCourse(course)} padding>
				<!-- Card content for course -->
				<!-- Checking if course has children courses or not, so we can render the href links accordingly. Rest of the content stays the same -->
				{#if course.childCourses && course.childCourses.length > 0}
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<ion-item
						on:click={() => navigateToCourse(course)}
						lines="none"
						class="ion-no-padding"
					>
						<CourseRow {course} />
					</ion-item>
				{:else}
					<ion-item lines="none" class="ion-no-padding">
						<CourseRow {course} />
					</ion-item>
				{/if}

				<!-- If the current course has children courses, add them below -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				{#if course.childCourses && course.childCourses.length > 0}
					<div class="children" class:open={childrenOpen[index]}>
						{#each course.childCourses as childCourse}
							<!-- Card content for child course -->
							<ion-item
								on:click={() => navigateToCourse(childCourse)}
								lines="none"
								class="ion-no-padding"
							>
								<CourseRow course={childCourse} />
							</ion-item>
						{/each}
					</div>

					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<ion-icon
						class="icon arrow"
						on:click={() => toggleChildren(index)}
						size="large"
						icon={allIonicIcons.caretDown}
						class:arrowOpen={childrenOpen[index]}
					/>
				{/if}
			</AppCard>
		{/each}
	{/if}
</div>

<style>
	.icon {
		min-width: 100%;
	}

	.title {
		font-size: 1.5rem;
	}

	.subtitle {
		font-size: 0.9rem;
		color: var(--app-color-primary-dark);
		font-weight: bold;
	}

	.scroll {
		scroll-margin-top: 8.2rem;
		display: block;
		height: 1rem;
	}

	.semester {
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 0.5rem !important;
	}

	.children {
		visibility: hidden;
		overflow: hidden;
		transition: max-height 0.3s ease;
		max-height: 0rem;
	}

	.open {
		max-height: 10rem;
		visibility: initial;
	}

	.arrow {
		margin-bottom: -1rem;
		transform: rotate(0deg);
		transition: transform 0.5s ease-in-out;
	}

	.arrowOpen {
		transform: rotate(180deg);
	}
</style>
