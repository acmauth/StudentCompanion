<script>
	import { afterUpdate, onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	/**
	 * @type {{ title: any; code: any; courseType: any; teacher: string; ects: any; semester: any; season: any; weeklyHours: any; period: any; }}
	 */
	export let course;
	/**
	 * @type {{ grade: number; totalStudents: any; studentsLikeMe: any; studentsBetterThanMe: any; studentsWorseThanMe: any; passedCount: any; failedCount: any; averageGrade: any; averageGradePassed: any; gradesCount: any; }}
	 */
	export let stats;

	// Slot machine animation variables
	let targetNumber = 0;
	const maxIterations = stats.grade;
	let currentIteration = 0;
	/**
	 * @type {HTMLElement | null}
	 */
	let numberElement;
	let gradeData = [];
	let grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	let maximum = 0;
	let chart;

	const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--app-color-primary-dark').trim();

	// Slot machine animation function
	function animate() {
		const randomNumber = currentIteration+1;
		if (numberElement) {
			numberElement.textContent = randomNumber.toString();
			if (randomNumber < maxIterations) {
				currentIteration++;
				setTimeout(() => {
					requestAnimationFrame(animate);
				}, 60);
			} else {
				numberElement.textContent = targetNumber.toString();
			}
		}
	}

	function startSlotMachine() {
		numberElement = document.getElementById('number');

		if (numberElement) {
			animate();
		}
	}

	afterUpdate(() => {
		if (stats.grade !== undefined) {
			targetNumber = stats.grade;
			startSlotMachine();
		}
	});

	onMount(() => {
		try {
			// Process data for the chart
			gradeData = Object.values(stats.gradesCount);
			maximum = Math.max(...gradeData);

			// Create a bar chart using Chart.js
			const ctx = document.getElementById('gradeChart').getContext('2d');
			const colors = grades.map((grade) => (grade < 5 ? '#515151' : primaryColor));
			chart = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: grades,
					datasets: [
						{
							data: gradeData,
							backgroundColor: colors,

							borderWidth: 1
						}
					]
				},
				options: {
					scales: {
						y: {
							stacked: true,
							beginAtZero: true,
							max: maximum
						}
					},
					plugins: {
						legend: {
							display: false
						},

						title: {
							display: true,
							text: 'Κατανομή Βαθμολογίας',
							font: {
								size: 15,
							},
							color: primaryColor
						}
					},


					layout: {
						padding: {
							left: 20,
							right: 20,
							top: 0,
							bottom: 0
						}
					}
				}
			});
		} catch (error) {
			console.log('Πρόβλημα εμφάνισης', error);
		}
	});

	
</script>


	<ion-card>
		<ion-card-header>
			<ion-card-title class="title">{course.title}</ion-card-title>
			<ion-card-subtitle color="primary"># {course.code}</ion-card-subtitle>
			<ion-card-subtitle>Τύπος: {course.courseType}</ion-card-subtitle>
		</ion-card-header>

		<!-- Checking if there is a grade and displays the corresponding color depending if you passed or not -->
		<ion-card-content class="ion-text-center">
			{#if !stats.grade}
				<ion-text><b>-</b></ion-text>
				<br>
				<ion-text class="danger">Δεν έχεις βαθμολογήθει ακόμα στο μάθημα</ion-text>
			{:else if stats.grade * 10 >= 5}
				<ion-text class="success" id="number">{stats.grade}</ion-text>
			{:else}
				<ion-text class="danger" id="number">{stats.grade}</ion-text>
			{/if}

			<!-- Course info -->

			<ion-list>

				<ion-item lines ="full">
					<ion-label>ECTS</ion-label>
					<ion-text slot="end">{course.ects}</ion-text>
				</ion-item>

				<ion-item lines ="full">
					<ion-label>Εξάμηνο</ion-label>
					<ion-text slot="end">{course.semester}ο</ion-text>
				</ion-item>
				<ion-item lines ="full">
					<ion-label>Περίοδος</ion-label>
					<ion-text slot="end">{course.season}</ion-text>
				</ion-item>
				<ion-item lines ="full">
					<ion-label >Εβδομαδιαίες ώρες</ion-label>
					<ion-text slot="end">{course.weeklyHours}</ion-text>
				</ion-item>

				<ion-accordion-group class="accordion" expand="compact">
					<ion-accordion value="first">
						<ion-item slot="header" color="white">
							<ion-label>Διδάσκοντες</ion-label>
						</ion-item>
						{#each course.teacher.split(', ') as teacher}
							<h3 class="teachers" slot="content">{teacher}</h3>
						{/each}
					</ion-accordion>
				</ion-accordion-group>
			</ion-list>
		</ion-card-content>
	</ion-card>

	<ion-card>
		<ion-card-header>
			<ion-card-title class="title">Στατιστικά</ion-card-title>
			{#if course.period}
				<ion-card-subtitle>Εξεταστική {course.period}</ion-card-subtitle>
			{:else}
				<ion-card-subtitle>-</ion-card-subtitle>
			{/if}
		</ion-card-header>
		<ion-card-content>
		{#if stats.grade}
			<ion-list>
				<ion-item lines ="full">
					<ion-label>Βαθμολογημένοι</ion-label>
					<ion-text slot="end">{stats.totalStudents}</ion-text>
				</ion-item>
				<ion-item lines ="full">
					<ion-label>Φοιτητές με ίδιο βαθμό</ion-label>
					<ion-text slot="end">{stats.studentsLikeMe}</ion-text>
				</ion-item>
				<ion-item lines ="full">
					<ion-label>Φοιτητές με καλύτερο βαθμό</ion-label>
					<ion-text slot="end">{stats.studentsBetterThanMe}</ion-text>
				</ion-item>
				<ion-item lines ="full">
					<ion-label>Φοιτητές με χειρότερο βαθμό</ion-label>
					<ion-text slot="end">{stats.studentsWorseThanMe}</ion-text>
				</ion-item>
				<ion-item lines ="full">
					<ion-label>Φοιτητές που πέρασαν</ion-label>
					<ion-text slot="end">{stats.passedCount}</ion-text>
				</ion-item>
				<ion-item lines ="full">
					<ion-label>Φοιτητές που κόπηκαν</ion-label>
					<ion-text slot="end">{stats.failedCount}</ion-text>
				</ion-item>
				<ion-item lines ="full">
					<ion-label>Μέσος όρος</ion-label>
					<ion-text slot="end">{stats.averageGrade}</ion-text>
				</ion-item>
				<ion-item lines="none">
					<ion-label>Μέσος όρος επιτυχόντων</ion-label>
					<ion-text slot="end">{stats.averageGradePassed}</ion-text>
				</ion-item>
			</ion-list>
		{:else}
			<ion-list>
				<ion-item>
					<ion-text class="ion-padding" color="danger"
						>Δεν υπάρχουν στατιστικά για την εξεταστική ακόμη</ion-text
					>
				</ion-item>
			</ion-list>
		{/if}
		<canvas id="gradeChart" />
	</ion-card-content>
	</ion-card>

	


<style>


	ion-text {
		color: var(--app-color-primary-dark);
	}

	.teachers {
		padding-top: 0.8rem;
		color: var(--app-color-primary-dark)
	}

	#number {
		font-size: 3rem;
		font-weight: 700;
		margin-bottom: 1rem;
		text-align: center;
	}

	ion-card {
		box-shadow: none;
	}

	ion-accordion-group {
	margin-top: 0.2rem;
	}

	.title {
		color: var(--app-color-primary-dark);
		font-weight: bold;
	}


	.success {
		color: var(--app-color-green-dark);
	}

	.danger {
		color: var(--app-color-orange-dark);
	}


  


	
</style>
