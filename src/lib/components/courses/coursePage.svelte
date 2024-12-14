<script lang="ts">
	import { statistics } from '$lib/functions/courseExam/courseStats/statistics.js';
	import { courseInformation } from '$lib/functions/courseExam/courseInfo/courseInfo.js';
	import CourseStats from '$lib/components/courses/courseInfo.svelte'
	import CoursesSkeleton from "$lib/components/courses/coursesSkeleton.svelte";
	import SubPageHeader from '$shared/subPageHeader.svelte';
	import { t } from "$lib/i18n";


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
		gradesCount: {},
		top10Percent: false
	};

	export let id;
	let result;

	// Extract courseCode from the URL
	// const courseCode = $page.params.courseId;
	const courseCode = id;

	async function getData() {
		try {
		// Fetch course information
		result = await courseInformation(courseCode);
		if (result) {
			
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

		}
		
		// Fetch statistics
		result = await statistics(courseCode);
		if (result) {	
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
		stats.top10Percent = result.topPercent;
		}



	} catch (error) {
		console.log("Error",error);
	
		}

	}

	


</script>

<ion-content fullscreen>
<SubPageHeader title={$t("course.title")} stackedNav/> <!-- subtitle={courseCode} /> -->

	
	{#await getData()}
	
	<ion-progress-bar type="indeterminate"/>
	{#each {length: 3} as i}
		<CoursesSkeleton />
	{/each}
	
	
	{:then}
		<CourseStats stats={stats} course={course} />
		
	{:catch error}
    <p>{error.message}</p>
	{/await}

	</ion-content>

<style>

ion-content {
	--padding-end: 0.6rem;
	--padding-start: 0.6rem;
}

</style>
	
	
