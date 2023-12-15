<script>
	import Chart from "chart.js/auto";
	import { afterUpdate, onMount } from 'svelte';
	import {averages} from '$lib/functions/gradeAverages/averages';
	import {coursesPerSemester} from '$lib/functions/gradeAverages/gradesPerSemester';

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

		coursesPerSemester().then((result) => {
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
						
					},
				],
			},
			options: {
				responsive: false,
				scales: {
					y: {
						beginAtZero: false,
						
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
<ion-card class="ion-text-center ion-padding-vertical">
	<ion-card-header>
		<ion-card-subtitle>
			<h2>Περασμένα μαθήματα</h2>
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
				<ion-label >ECTS</ion-label>
				<ion-text color="tertiary">
					<h2>{gradesObject.ects}</h2>
				</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>M.O με συντελεστές</ion-label>
				<ion-text color="tertiary">
					<h2>{gradesObject.weightedAverage}</h2>
				</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>M.O απλός</ion-label>
				<ion-text color="tertiary">
					<h2>{gradesObject.average}</h2>
				</ion-text>
			</ion-item>
		</ion-list>
		<div>
			<canvas id="gradeChart"></canvas>
		</div>
	</ion-card-content>
		
	
</ion-card>
{/if}

<style>
	circle-progress::part(base) {
		width: 120px; 
		height: auto;

		}

	circle-progress::part(value) {
		stroke: #3880ff;
		}
	
</style>
