<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { statistics } from '$lib/functions/courseExam/courseStats/statistics.js';
	import { courseInformation } from '$lib/functions/courseExam/courseInfo/courseInfo.js';
	import Chart from "chart.js/auto";

	let course = {
		title: '',
		code: '',
		ects: 0,
		teacher: '',
		grade: '',
		semester: '',
		weeklyHours: 0
	};

	let stats = {
		grade: 0,
		totalStudents: '0',
		studentsLikeMe: 0,
		studentsBetterThanMe: 0,
		studentsWorseThanMe: 0,
		passedCount: 0,
		failedCount: 0,
		averageGrade: 0,
		averageGradePassed: 0
	};

	const data = [5, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const grades = [1,2,3,4,5,6,7,8,9,10];


	const courseCode = $page.params.courseId;

	onMount(async () => {

		statistics(courseCode).then((result) => {
			stats.grade = result.myGrade * 10;
			stats.studentsLikeMe = result.studentsLikeMe;
			stats.studentsBetterThanMe = result.studentsBetterThanMe;
			stats.studentsWorseThanMe = result.studentsWorseThanMe;
			stats.passedCount = result.studentsPassed;
			stats.failedCount = result.studentsFailed;
			stats.totalStudents = result.totalStudents;
			// fix to 2 digits after decimal point
			stats.averageGradePassed = result.averagePassed.toFixed(1);
			stats.averageGrade = result.average.toFixed(1);
		});

		courseInformation(courseCode).then((result) => {
			course.title = result.courseTitle;
			course.code = courseCode;
			course.ects = result.ects;

			// get teacher name for each teacher

			let teachers = result.courseInstructors;
			let teacherNames = [];
			for (const teacher of teachers) {
				teacherNames.push(teacher.givenName + ' ' + teacher.familyName);
			}
			course.teacher = teacherNames.join(', ');
			course.semester = result.semester;
			course.weeklyHours = result.weeklyHours;
		});



		const ctx = document.getElementById("gradeChart").getContext("2d");
	  	chart = new Chart(ctx, {
	    type: "bar",
	    data: {
	      labels: grades,
	      datasets: [
	        {
	          data: data,
	          backgroundColor: "#3880ff",
	          borderColor: "#3880ff",
	          borderWidth: 3,
	        },
	      ],
	    },
	    options: {
	      scales: {
	        y: {
				stacked: true,
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
				text: 'Κατανομή Βαθμολογίας',
				font: {
					size: 15
				}
			}
	      },
	    },
  });



	});
</script>

<ion-header>
	<ion-toolbar>
		<ion-title>Course Info</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content>
	<ion-card>
		<ion-card-header>
			<ion-card-title>{course.title}</ion-card-title>
			<ion-card-subtitle>{course.code}</ion-card-subtitle>
		</ion-card-header>

		<ion-card-content class="ion-text-center">
			{#if stats.grade === 0}
				<ion-text color="danger">Δεν έχεις βαθμολογήθει ακόμα στο μάθημα</ion-text>
			{:else if stats.grade * 10 >= 5}
				<circle-progress class="passed" max={10} value={stats.grade} />
			{:else}
				<circle-progress class="failed" max={10} value={stats.grade} />
			{/if}

			<ion-list>
				<ion-item>
					<ion-label>ECTS</ion-label>
					<ion-text slot="end">{course.ects}</ion-text>
				</ion-item>
				<ion-item>
					<ion-label>Διδάσκοντες</ion-label>
					<ion-text slot="end">{course.teacher}</ion-text>
				</ion-item>
				<ion-item>
					<ion-label>Περίοδος</ion-label>
					<ion-text slot="end">{course.semester}</ion-text>
				</ion-item>
				<ion-item>
					<ion-label>Εβδομαδιαίες ώρες</ion-label>
					<ion-text slot="end">{course.weeklyHours}</ion-text>
				</ion-item>
			</ion-list>
		</ion-card-content>
	</ion-card>

	<ion-card>
		<ion-card-header>
			<ion-card-title>Στατιστικά</ion-card-title>
		</ion-card-header>
		<ion-list>
			<ion-item>
				<ion-label>Βαθμολογημένοι</ion-label>
				<ion-text slot="end">{stats.totalStudents}</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>Φοιτητές με ίδιο βαθμό</ion-label>
				<ion-text slot="end">{stats.studentsLikeMe}</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>Φοιτητές με καλύτερο βαθμό</ion-label>
				<ion-text slot="end">{stats.studentsBetterThanMe}</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>Φοιτητές με χειρότερο βαθμό</ion-label>
				<ion-text slot="end">{stats.studentsWorseThanMe}</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>Φοιτητές που πέρασαν</ion-label>
				<ion-text slot="end">{stats.passedCount}</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>Φοιτητές που κόπηκαν</ion-label>
				<ion-text slot="end">{stats.failedCount}</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>Μέσος όρος</ion-label>
				<ion-text slot="end">{stats.averageGrade}</ion-text>
			</ion-item>
			<ion-item>
				<ion-label>Μέσος όρος επιτυχόντων</ion-label>
				<ion-text slot="end">{stats.averageGradePassed}</ion-text>
			</ion-item>
		</ion-list>
	</ion-card>

	<canvas id="gradeChart"></canvas>


</ion-content>

<style>
	circle-progress::part(base) {
		width: 120px;
		height: auto;
	}

	.passed::part(value) {
		stroke: #2dd36f;
	}
	.failed::part(value) {
		stroke: #eb445a;
	}
</style>

