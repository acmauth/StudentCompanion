import { onMount } from "svelte";
import { universisGet } from "$lib/dataService";

// HTML elements
let _g_avg = "";
let _w_avg = "";

// This code runs when the component is mounted to the DOM
export async function averages() {

	// Fetch exam data for the current student
	let exams = await universisGet("students/me/grades?$top=-1&$filter=isPassed eq 1");

	// Fetch a list of courses for the current student
	let courses = (await universisGet("students/me/courses?$top=-1")).value;

	let k = 0;
	let passed_courses = [];

	// Loop through the courses to find the passed ones
	for (const course of courses)
		if (course.isPassed == 1)
			passed_courses[k++] = course;

	let i = 0, j = 0;
	let g_grades = [];
	let g_sum = 0;
	let g_avg = 0;
	let w_sum = 0;
	let w_avg = 0;
	let ects_sum = 0;
	let courses_codes = [];
	let ects_list = [];

	let grades = {};

	// Extract the grades and course codes from the exams
	for (const exam of exams.value) {
		g_grades[i] = exam.formattedGrade * 1;
		courses_codes[i++] = exam.course;
	}

	// Calculate the sum of grades and their average
	g_sum = g_grades.reduce((total, currentValue) => total + currentValue, 0);
	if (g_grades.length > 0)
		g_avg = Number((g_sum / g_grades.length).toFixed(2));
	_g_avg = String(g_avg);

	// Loop through course codes to find their corresponding ECTS values
	for (const code of courses_codes)
		for (const courseEntry of passed_courses)
			if (courseEntry.course == code)
				ects_list[j++] = courseEntry.ects;

	i = 0;
	for (const g of g_grades)
		// Calculate the weighted sum of grades
		w_sum += g * ects_list[i++];

	// Calculate the weighted average
	w_avg = Number((w_sum / ects_list.reduce((total, currentValue) => total + currentValue, 0)).toFixed(2));
	_w_avg = String(w_avg);

	//	Calculate total ects
	
	for (const ects of ects_list)
		ects_sum += ects;

	// find average per semester and store it in an array

	let semesters = [];
	let semesters_avg = [];

	



	grades = {
		"grades": g_grades,
		"avg": g_avg,
		"weighted_avg": w_avg,
		"ects": ects_sum,
	};

	

	return grades;

};