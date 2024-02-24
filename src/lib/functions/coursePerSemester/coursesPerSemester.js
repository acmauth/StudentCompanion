import { universisGet } from '$lib/dataService';


// returns the courses by each semester

export async function coursesPerSemester(subjectsJSON = null) {
	let subjects;
	let courseBySemester = [];
	if (subjectsJSON) {
		subjects = subjectsJSON;
	}
	 
	else {
		subjects = (await universisGet('students/me/courses?$top=-1')).value;
	}

	// Group the courses by semester
	
	courseBySemester = subjects.reduce((/** @type {{ [x: string]: any[]; }} */ acc, /** @type {{ semester: { id: string | number; }; }} */ course) => {
		if (!acc[course.semester.id]) {
			acc[course.semester.id] = [];
		}
		acc[course.semester.id].push(course);
		return acc;
	}, {});


	return courseBySemester;

};