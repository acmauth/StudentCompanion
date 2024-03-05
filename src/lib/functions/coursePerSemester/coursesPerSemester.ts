import { neoUniversisGet } from '$lib/dataService';
import type {course} from '$lib/types/courseType';

// returns the courses by each semester
export async function coursesPerSemester(subjectsJSON: course[] | null | undefined = null) {

	let subjects: course[];
	let courseBySemester: { [key: string]: course[] } = {};

	if (subjectsJSON) {
		subjects = subjectsJSON;
	}
	 
	else {
		subjects = (await neoUniversisGet('students/me/courses?$top=-1',{lifetime: 600})).value;
	}

	// Group the courses by semester
	courseBySemester = subjects.reduce((accumulator: { [key: string]: course[] }, currentCourse) => {

		const semesterId = String(currentCourse.semester.id); // Ensure semesterId is a string
		
		if (!(semesterId in accumulator)) {
			accumulator[semesterId] = [];
		}
		accumulator[semesterId].push(currentCourse);
		return accumulator;
	}, {});

	console.log(courseBySemester);
	
	return courseBySemester;

};