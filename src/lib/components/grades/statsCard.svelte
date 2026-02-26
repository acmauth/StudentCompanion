<script lang="ts">
	import Chart from 'chart.js/auto';
	import { afterUpdate, onMount } from 'svelte';
	import { averages } from '$lib/functions/gradeAverages/averages';
	import * as allIonicIcons from 'ionicons/icons';
	import Chip from '$components/shared/Chips.svelte';
	import { t } from '$lib/i18n';

	export let subjects;
	export let passedSubjects;
	export let searchQuery;
	export let flip;
	export let subjectsJSON: null | undefined;

	interface Registration {
		id: number;
		semester: number;
		classes: { id: string; finalGrade: number; coefficient: number; isPassed: number; registration: number; course: string }[];
	}
	interface AveragesResult {
		avg: number;
		weighted_avg: number;
		grades: never[];
		ects: number;
	}


	export let registrationsInDegree: Registration[];

	const root = document.body.classList.contains('dark') ? document.body : document.documentElement;
	const primaryColor = getComputedStyle(root).getPropertyValue('--app-color-grade-graph').trim();
	const gradeFill = getComputedStyle(root).getPropertyValue('--app-color-grade-graph-fill').trim();

	let chart: Chart<'line', any, any>;
	let chartElement: HTMLCanvasElement;
	let gradesObject = {
		average: 0,
		weightedAverage: 0,
		grades: [],
		ects: 0,
	};

	function calculateGpaPerSemester(registrationsInDegree: Registration[]): Record<number, string> {
		const semesterAverages: Record<number, string> = {};

		registrationsInDegree.forEach((registration) => {
			const coefficientSum = registration.classes.reduce((sum, c) => sum + c.coefficient, 0);
			const weightedSum = registration.classes.reduce((sum, c) => sum + c.coefficient * c.finalGrade, 0);

			if (coefficientSum > 0) {
				semesterAverages[registration.semester] = ((10 * weightedSum) / coefficientSum).toFixed(2);
			}
		});

		return semesterAverages;
	}

	onMount(async () => {
		try {
			const avgResult: AveragesResult = await averages(subjectsJSON)

			gradesObject.average = avgResult.avg;
			gradesObject.weightedAverage = avgResult.weighted_avg;
			gradesObject.grades = avgResult.grades;
			gradesObject.ects = avgResult.ects;
		} catch (error) {
			console.error(error);
		}
	});

	afterUpdate(() => {
		if (chart) chart.destroy();

		if (searchQuery.length || !chartElement) return;

		chart = new Chart(chartElement, {
			type: 'line',
			data: {
				datasets: [
					{
						data: calculateGpaPerSemester(registrationsInDegree),
						fill: { target: 'origin', above: gradeFill },
						tension: 0.4,
						borderColor: primaryColor,
						backgroundColor: 'primaryColor'
					}
				]
			},
			options: {
				responsive: true,
				scales: {
					y: { beginAtZero: false, grid: { display: false } },
					x: { grid: { display: false } }
				},
				plugins: {
					legend: { display: false },
					title: {
						display: true,
						text: $t('progress.average_evolution'),
						font: { size: 15 }
					}
				}
			}
		});
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
			<canvas id="gradeChart" bind:this={chartElement} />
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