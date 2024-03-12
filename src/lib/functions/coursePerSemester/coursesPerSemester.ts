import { neoUniversisGet } from '$lib/dataService';
import type {course} from '$lib/types/courseType';

// returns the courses for each semester
export async function coursesPerSemester(subjectsJSON: course[] | null | undefined = null) {

	let subjects: course[];
	let courseBySemester: { [key: string]: course[] } = {};

	if (subjectsJSON) {
		subjects = subjectsJSON;
	}
	 
	else {
		subjects = (await neoUniversisGet('students/me/courses?$top=-1',{lifetime: 600})).value;
	}

	// Sort courses by parentCourse property. First should be the courses with no parentCourse property
	subjects.sort((a, b) => {
		if (a.parentCourse && !b.parentCourse) {
			return 1;
		}
		if (!a.parentCourse && b.parentCourse) {
			return -1;
		}
		return 0;
	});

	
	
	// Group the courses by semester. If the current course has a parent property, it will be grouped with the parent course by adding a childCourses property to the parent course, otherwise it will be grouped by itself
	
	for (const course of subjects) {
		const semester = String(course.semester.id); // Ensure that the semester is a string

		// If the course has a parentCourse property, it will be grouped with the parent course
		if (course.parentCourse) {

			// Check if the semester is already present in the courseBySemester object
			if (!courseBySemester[semester]) {
				courseBySemester[semester] = [];
			}

			// Check if the course is already present in the semester
			const parentCourse = subjects.find(c => c.course === course.parentCourse);
			if (parentCourse) {
				// Check if the parentCourse has a childCourses property. If not, it will be created
				if (!parentCourse.childCourses) {
					parentCourse.childCourses = [];
				}
				// Check if the childCourse is already present in the parentCourse
				if (!parentCourse.childCourses.some(c => c.course === course.course)) {
					parentCourse.childCourses.push(course);
				}
			}
		} 
		// If the course has no parentCourse property, it will be grouped by itself
		else {
			if (!courseBySemester[semester]) {
				courseBySemester[semester] = [];
			}
			courseBySemester[semester].push(course);
		}
	}

	
	return courseBySemester;

};