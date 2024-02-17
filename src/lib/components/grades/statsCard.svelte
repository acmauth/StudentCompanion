<script>
	import Chart from "chart.js/auto";
	import { afterUpdate, onMount } from 'svelte';
	import {averages} from '$lib/functions/gradeAverages/averages';
	import {averagesPerSemester} from '$lib/functions/gradeAverages/averagesPerSemester';
	import * as allIonicIcons from 'ionicons/icons';



	/**
	 * @type {any}
	 */
	 export let subjects;
	/**
	 * @type {any}
	 */
	 export let passedSubjects;
	 export let searchQuery;


	 
	 /**
	 * @type {Chart<"line", number[], string>}
	 */

	 const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--app-color-primary-dark').trim();

	 let chart;
	 let gradesObject = {
		"average": 0,
		"weightedAverage": 0,
		"grades": [],
		"ects": 0,
		"averagesPerSemester": [],
		"semester": []
	 };

	// Dummy data for average grades

	onMount(() => {
		averages().then((result) => {
			gradesObject.average = result.avg;
			gradesObject.weightedAverage = result.weighted_avg;
			gradesObject.grades = result.grades;
			gradesObject.ects = result.ects;
		});


		  averagesPerSemester().then((result) => {

			gradesObject.averagesPerSemester = result;
			
			for (let i = 1; i < result.length+1; i++) {
				gradesObject.semester[i-1] = i;
			}

			
		});

	});

	afterUpdate(() => {
		if (chart) {
			chart.destroy();
		}
		if (!searchQuery.length) {
		chart = new Chart(document.getElementById('gradeChart'), {
			type: 'line',
			data: {
				labels: gradesObject.semester,
				datasets: [
					{
						data: gradesObject.averagesPerSemester,
						fill: {
							target: 'origin',
							above: "rgb(230, 239, 255)",
						},
						tension: 0.4,
						borderColor: primaryColor, // Set the color here
            			backgroundColor: primaryColor // Optionally set the fill color
						
					},
				],
			},
			options: {
				responsive: true,
				scales: {
					y: {
						beginAtZero: false,
						grid: {
							display: false,
						},
						
					},
				},
				plugins: {
					legend: {
						display: false,
					},
					title: {
						display: true,
						text: 'Εξέλιξη Μέσου όρου',
						font: {
							size: 15
						}
					}
				},
			},
		});
	}

	});

	
</script>

{#if !searchQuery.length}
<ion-card class="ion-text-center ion-padding-vertical stats">
	<ion-card-header>
		<ion-card-subtitle>
			<h2 class="subtitle">Περασμένα μαθήματα</h2>
		</ion-card-subtitle>
	</ion-card-header>
	<ion-card-content>
	{#if !subjects}
			Loading...
	{:else}
		<circle-progress max={subjects} value={passedSubjects} ></circle-progress>
	{/if}
		<ion-list>
			<ion-item >
				<ion-label>ECTS</ion-label>
				<ion-text>
					<h2>{gradesObject.ects}</h2>
				</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>M.O με συντελεστές</ion-label>
				<ion-text color="tertiary">
					<h2>{gradesObject.weightedAverage}</h2>
				</ion-text>
			</ion-item>
			<ion-item class="ion-padding-bottom">
				<ion-label>M.O απλός</ion-label>
				<ion-text color="tertiary">
					<h2>{gradesObject.average}</h2>
				</ion-text>
			</ion-item>

			
			<canvas id="gradeChart"></canvas>

			<ion-chip class="chip">
				<div class="chipFlex">
					<ion-icon icon={allIonicIcons.calculator}></ion-icon>
				Πρόβλεψη Μ.Ο.
				</div>
				
			</ion-chip>

		</ion-list>

	</ion-card-content>
		
	
</ion-card>
{/if}

<style>

	ion-text {
		color: var(--app-color-primary-dark);
	}

	ion-icon {
		color: var(--app-color-primary-dark);
	}

	circle-progress::part(base) {
		width: 120px; 
		height: auto;
		}
	
	circle-progress::part(value) {
		stroke-width: 10;
		stroke: var(--app-color-primary-dark);
	}
	circle-progress::part(circle) {
		stroke-width: 10;
		stroke: var(--app-color-primary-light);
	}
	circle-progress::part(text) {
		font-weight: bold;
		fill: var(--app-color-primary-dark);
	}

	.chipFlex {
		display: flex;
		gap: 0.2rem;
		align-items: center;
		font-size: 0.8rem;
	}

	.subtitle {
		color: var(--app-color-primary-dark);
		font-weight: medium;
	}

	.stats {
		box-shadow: none;
	}

	.chip {
		margin-top: 1.5rem;
		background-color: rgba(236, 242, 252, 1);	
		color: var(--app-color-primary-dark);
		font-weight: 700;
	}
	


</style>
