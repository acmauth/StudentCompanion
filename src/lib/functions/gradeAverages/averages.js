import { neoUniversisGet } from "$lib/dataService";


// This code runs when the component is mounted to the DOM
export async function averages(subjectsJSON = null) {

	let courses;

	if (subjectsJSON) {
		courses = subjectsJSON;
	}
	else {
		courses = (await neoUniversisGet("students/me/courses?$top=-1", { lifetime: 600 })).value;
	}

	let k = 0;
	let passed_courses = [];

	// Loop through the courses to find the passed ones
	for (const course of courses)
		if (course.isPassed == 1 && course.parentCourse == null && course.calculateGrade == 1)
			passed_courses[k++] = course;

	let i = 0;
	let g_grades = [];
	let g_sum = 0;
	let g_avg = 0;
	let w_sum = 0;
	let w_avg = 0;
	let ects_sum = 0;
	let ects_list = [];
	let ects_sum_countable = 0;

	let grades = {};

	// Extract the grades and course codes from the exams
	for (const c of passed_courses) {
		if (!isNaN(c.formattedGrade)) {
			g_grades[i] = c.formattedGrade * 1;
			ects_list[i++] = c.ects;
		}
		ects_sum += c.ects ? c.ects : 0;
	}

	// Calculate the sum of grades and their average
	g_sum = g_grades.reduce((total, currentValue) => total + currentValue, 0);
	if (g_grades.length > 0) {
		g_avg = Math.floor(g_sum * 100 / g_grades.length) / 100;
		g_avg.toFixed(2);
	}

	// Calculate the weighted sum of grades
	// i = 0;
	// for (const g of g_grades)
	// 	w_sum += g * ects_list[i++];

	//	Calculate total ects
	// for (const ects of ects_list)
	// 	ects_sum_countable += ects;


	// Calculate the weighted average
	let coefficients = 0;
	for (const course of passed_courses)
		coefficients += course.coefficient;

	if (coefficients > 0) {
		w_sum = 0;
		for (const course of passed_courses)
			w_sum += course.grade * course.coefficient;

		let temp = w_sum * 10 / coefficients;
		w_avg = Number((Math.round(temp * 100) / 100).toFixed(2));

	}


	// Calculate the weighted average
	// w_avg = Number((w_sum / ects_sum_countable).toFixed(3)).toFixed(2);

	grades = {
		"grades": g_grades,
		"avg": g_avg,
		"weighted_avg": w_avg,
		"ects": ects_sum,
	};

	return grades;
};