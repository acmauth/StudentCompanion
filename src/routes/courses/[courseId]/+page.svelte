<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { statistics } from '$lib/functions/courseExam/courseStats/statistics.js';
	import { courseInformation } from '$lib/functions/courseExam/courseInfo/courseInfo.js';
	import Chart from 'chart.js/auto';
	import CourseStats from '$lib/components/courses/courseInfo.svelte'

	// Initiniatize variables
	let course = {
		title: '',
		code: '',
		ects: 0,
		teacher: '',
		grade: '',
		semester: '',
		weeklyHours: 0,
		courseType: '',
		period: '',
		season: ''
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
		averageGradePassed: 0,
		gradesCount: {}
	};

	let gradeData = [];
	let grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	let maximum = 0;

	// Extract courseCode from the URL
	const courseCode = $page.params.courseId;

	onMount(async () => {
		// Fetch statistics
		statistics(courseCode)
			.then((result) => {
				stats.grade = result.myGrade;
				stats.studentsLikeMe = result.studentsLikeMe;
				stats.studentsBetterThanMe = result.studentsBetterThanMe;
				stats.studentsWorseThanMe = result.studentsWorseThanMe;
				stats.passedCount = result.studentsPassed;
				stats.failedCount = result.studentsFailed;
				stats.totalStudents = result.totalStudents;
				// fix to 2 digits after decimal point
				stats.averageGradePassed = result.averagePassed.toFixed(1);
				stats.averageGrade = result.average.toFixed(1);
				stats.gradesCount = result.gradesCount;

				// Process data for the chart
				gradeData = Object.values(stats.gradesCount);
				maximum = Math.max(...gradeData);

				// Create a bar chart using Chart.js
				const ctx = document.getElementById('gradeChart').getContext('2d');
				const colors = grades.map(grade =>  (grade < 5 ? '#eb445a' : '#2dd36f'))
				chart = new Chart(ctx, {
					type: 'bar',
					data: {
						labels: grades,
						datasets: [
							{
								data: gradeData,
								backgroundColor: colors,

                				borderWidth: 1,
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
									size: 15
								}
							}
						}
					}
				});
			})
			.catch((error) => {
				console.log('Error', error);
			});

		// Fetch course information
		courseInformation(courseCode)
		
			.then((result) => {
				// Assign values from the result to course
				course.title = result.courseTitle;
				course.code = courseCode;
				course.ects = result.ects;

				// Get teacher name for each teacher
				let teachers = result.courseInstructors;
				let teacherNames = [];
				for (const teacher of teachers) {
					teacherNames.push(teacher.givenName + ' ' + teacher.familyName);
				}
				course.teacher = teacherNames.join(', ');
				course.semester = result.semester;
				course.weeklyHours = result.weeklyHours;
				course.courseType = result.courseType;
				course.season = result.season;


				if (result.period) {
					course.period = result.period;
				}
				
			})
			.catch((error) => {
				console.log('Error', error);
			});
	});
</script>

<CourseStats {stats} {course} />

