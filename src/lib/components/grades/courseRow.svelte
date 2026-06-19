<script lang="ts">
	import { t } from '$lib/i18n';

	interface CourseDetails {
		courseTitle: string;
		formattedGrade: string;
		grade: number;
		registrationType: number;
		examPeriod: { name: string } | null;
		gradeYear: { name: string } | null;
	}

	export let course: CourseDetails;
</script>

<div class="containerFlex">
	<div class="titlesFlex">
		<ion-label class="ion-text-wrap courseTitle">{course.courseTitle}</ion-label>

		{#if course.examPeriod != null}
			<ion-label class="examPeriod">
				{#if course.examPeriod && course.gradeYear}
					{course.examPeriod.name} {course.gradeYear.name}
				{:else if course.registrationType === 1}
					{$t('progress.exempted')}
				{:else}
					{$t('progress.declared')}
				{/if}
			</ion-label>
		{:else}
			<ion-label class="examPeriod">-</ion-label>
		{/if}
	</div>
	{#if course.grade != null && !isNaN(course.grade)}
		{#if course.grade * 10 >= 5}
			<ion-text class="success gradeNumber">
				<h2>{course.formattedGrade}</h2>
			</ion-text>
		{:else}
			<ion-text class="danger gradeNumber">
				<h2>{course.formattedGrade}</h2>
			</ion-text>
		{/if}
	{/if}
</div>

<style>
	.containerFlex {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-width: 100%;
		padding: 0.5rem;
	}

	.titlesFlex {
		display: flex;
		flex-direction: column;
		align-items: start;
	}

	.courseTitle {
		font-size: 1rem;
		margin-right: 0.5rem;
	}

	.examPeriod {
		font-size: 0.8rem;
		color: grey;
	}

	.success {
		color: var(--app-color-green-dark);
	}

	.danger {
		color: var(--app-color-orange-dark);
	}

	.gradeNumber h2 {
		margin: 0 !important;
		margin-right: -0.5rem !important;
		margin-left: 0.5rem !important;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: bold;
	}
</style>
