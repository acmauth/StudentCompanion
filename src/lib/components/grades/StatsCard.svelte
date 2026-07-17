<script lang="ts">
	import { onMount } from 'svelte';
	import { averages } from '$lib/functions/gradeAverages/averages';
	import * as allIonicIcons from 'ionicons/icons';
	import Chip from '$components/shared/Chips.svelte';
	import { t } from '$lib/i18n';
	import { gradeEvolutionChart } from './charts';
	import type { course } from '$lib/types/courseType';
	import type { AveragesResult, Registration } from '$types/grades';

	export let subjects: number;
	export let passedSubjects: number;
	export let flip: () => void;
	export let subjectsJSON: course[];
	export let registrationsInDegree: Registration[];

	let gradesObject = {
		average: 0,
		weightedAverage: 0,
		grades: [] as number[],
		ects: 0
	};

	onMount(async () => {
		try {
			const avgResult: AveragesResult = await averages(subjectsJSON);

			gradesObject.average = avgResult.avg;
			gradesObject.weightedAverage = avgResult.weighted_avg;
			gradesObject.grades = avgResult.grades;
			gradesObject.ects = avgResult.ects;
		} catch (error) {
			console.error(error);
		}
	});
</script>

<ion-card class="ion-text-center stats">
	<ion-card-header>
		<ion-card-subtitle>
			<h2 class="subtitle">{$t('progress.passed')}</h2>
		</ion-card-subtitle>
	</ion-card-header>
	<ion-card-content>
		{#if !subjects}
			<ion-text>{$t('progress.no_courses_found')}</ion-text>
		{:else}
			<circle-progress max={subjects} value={passedSubjects} />
		{/if}
		<ion-list>
			<ion-item>
				<ion-label>{$t('progress.grade_ects')}</ion-label>
				<ion-text><h2>{gradesObject.weightedAverage}</h2></ion-text>
			</ion-item>
			<ion-item>
				<ion-label>{$t('progress.grade_simple')}</ion-label>
				<ion-text><h2>{gradesObject.average}</h2></ion-text>
			</ion-item>
			<ion-item lines="none" class="ion-padding-bottom">
				<ion-label>ECTS</ion-label>
				<ion-text><h2>{gradesObject.ects}</h2></ion-text>
			</ion-item>
			<canvas
				id="gradeChart"
				use:gradeEvolutionChart={{
					registrations: registrationsInDegree,
					title: $t('progress.average_evolution')
				}}
			/>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<Chip chipIcon={allIonicIcons.calculator} text={$t('progress.average_prediction')} {flip} />
		</ion-list>
	</ion-card-content>
</ion-card>

<style>
	ion-text {
		color: var(--app-color-primary-dark-variation);
	}

	circle-progress::part(base) {
		width: 120px;
		height: auto;
	}

	circle-progress::part(value) {
		stroke-width: 10;
		stroke: var(--app-color-progress-value);
	}

	circle-progress::part(circle) {
		stroke-width: 10;
		stroke: var(--app-color-progress-circle);
	}

	circle-progress::part(text) {
		font-weight: bold;
		fill: var(--app-color-primary-dark);
	}

	.subtitle {
		color: var(--app-color-primary-dark);
		font-weight: medium;
		margin: 0.5rem;
	}
</style>
