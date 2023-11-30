<script>
	import Chart from "chart.js/auto";
	import { onMount } from 'svelte';
	/**
	 * @type {any}
	 */
	 export let subjects;
	/**
	 * @type {any}
	 */
	 export let passedSubjects;


	 
	 let chart;

// Dummy data for average grades
const semesters = ["1", "2", "3", "4","5"];
const averageGrades = [7.8, 4, 8.5, 9, 6];

onMount(() => {
  const ctx = document.getElementById("gradeChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: semesters,
      datasets: [
        {
          data: averageGrades,
          backgroundColor: "#3880ff",
          borderColor: "#3880ff",
          borderWidth: 3,
          fill: {
            target: 'origin',
            above: "rgb(230, 239, 255)",
          },
          tension: 0.4,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
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
});








</script>


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

	<ion-card-content>
		<ion-list>
			<ion-item >
				<ion-label >ECTS</ion-label>
				<ion-text color="tertiary">
					<h2>placeholder</h2>
				</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>M.O με συντελεστές</ion-label>
				<ion-text color="tertiary">
					<h2>placeholder</h2>
				</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>M.O απλός</ion-label>
				<ion-text color="tertiary">
					<h2>placeholder</h2>
				</ion-text>
			</ion-item>
		</ion-list>
	
		<canvas id="gradeChart"></canvas>
</ion-card>

<style>
	circle-progress::part(base) {
		width: 120px; 
		height: auto;

		}

	circle-progress::part(value) {
		stroke: #3880ff;
		}
	
	/* circle-progress::part(text) {
		stroke: #3880ff;
		stroke-width: 0.1;
		} */
</style>