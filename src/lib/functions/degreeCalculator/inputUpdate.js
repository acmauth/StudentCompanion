import { checkPrecision } from './checkPrecision.js';
import { numberCheck } from './numberCheck.js';
import { degreeGradeUpdate } from './degreeGradeUpdate.js';

/**
 * @param { { title: string, id: string, semester_id: number, semester_name: string, grade: number, input_grade: string, coefficient: number; }[] } unpassed_courses
 * @param { { based: { grade_sum:number, coefficient: number}, simple: {grade_sum: number, passed: number}; } } sums
 * @param { { based: {value: number, stringed: string}, simple: {value: number, stringed: string}; } } degree_grade
 */

export function inputUpdate(unpassed_courses, sums, degree_grade, customCourses = null) {
	let sums_guess = {
		based: { grade_sum: 0, coefficient: sums.based.coefficient },
		simple: { grade_sum: 0, passed: sums.simple.passed }
	};

	// Filter out custom courses from unpassed courses
	if (customCourses !== null) {
		// Add custom course grade to the sums
		for (const customCourse of customCourses) {
			const input_element = document.getElementById(customCourse.id);
			if (input_element != null) input_element.style.borderColor = '#ccc';

			if (numberCheck(customCourse)) continue;

			course = checkPrecision(customCourse);

			if (course.grade < 5 && input_element != null) {
				input_element.style.borderColor = 'red';
				continue;
			}

			sums_guess.based.grade_sum += Number(course.grade) * Number(course.coefficient);
			sums_guess.based.coefficient += Number(course.coefficient);
			sums_guess.simple.grade_sum += Number(course.grade);
			sums_guess.simple.passed++;
		}
	}
	for (var course of unpassed_courses) {
		const input_element = document.getElementById(course.id);
		if (input_element != null) input_element.style.borderColor = '#ccc';

		if (numberCheck(course)) continue;

		course = checkPrecision(course);

		if (course.grade < 5 && input_element != null) {
			input_element.style.borderColor = 'red';
			continue;
		}

		sums_guess.based.grade_sum += course.grade * course.coefficient;
		sums_guess.based.coefficient += course.coefficient;

		sums_guess.simple.grade_sum += course.grade;
		sums_guess.simple.passed++;
	}

	degreeGradeUpdate(degree_grade, sums, sums_guess);
}
