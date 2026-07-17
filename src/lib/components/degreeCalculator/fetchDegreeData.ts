import { neoUniversisGet } from '$lib/dataService';
import type { PassedSums } from './degreeGrade';

/** A course still to be passed, with the student's predicted grade for it. */
export type UnpassedCourse = {
	id: string;
	title: string;
	semester_id: number;
	semester_name: string;
	coefficient: number;
	grade: string;
	lastGrade: string;
	gradeNumber: number | null;
};

export type DegreeData = {
	unpassedCourses: UnpassedCourse[];
	passedSums: PassedSums;
};

/**
 * Splits the student's courses into what already counts towards the degree and
 * what is still outstanding. The API reports grades on a 0-1 scale, hence the
 * factor of 10 on the passed totals.
 */
export async function fetchDegreeData(): Promise<DegreeData> {
	const passedSums: PassedSums = {
		based: { grade_sum: 0, coefficient: 0 },
		simple: { grade_sum: 0, passed: 0 }
	};
	const unpassedCourses: UnpassedCourse[] = [];

	let courses: any[] = (await neoUniversisGet('students/me/courses?$top=-1', { lifetime: 60 * 5 }))
		.value;

	courses.sort((a, b) => a.semester.id - b.semester.id);
	courses = courses.filter((course) => course.calculateGrade == 1);

	for (const course of courses) {
		if (course.isPassed == 1) {
			passedSums.based.grade_sum += course.grade * course.coefficient * 10;
			passedSums.based.coefficient += course.coefficient;

			passedSums.simple.grade_sum += course.grade * 10;
			passedSums.simple.passed++;

			continue;
		}

		unpassedCourses.push({
			id: course.id,
			title: course.courseTitle,
			semester_id: course.semester.id,
			semester_name: course.semester.name,
			coefficient: course.coefficient,
			grade: '',
			lastGrade: '',
			gradeNumber: null
		});
	}

	return { unpassedCourses, passedSums };
}
