import { universisGet } from '$lib/dataService';


// returns the courses by each semester

export async function coursesPerSemester() {
	let subjects;
	let courseBySemester = [];
	subjects = (await universisGet('students/me/courses?$top=-1')).value;
	courseBySemester = subjects.reduce((/** @type {{ [x: string]: any[]; }} */ acc, /** @type {{ semester: { id: string | number; }; }} */ course) => {
		if (!acc[course.semester.id]) {
			acc[course.semester.id] = [];
		}
		acc[course.semester.id].push(course);
		return acc;
	}, {});


	return courseBySemester;

};



