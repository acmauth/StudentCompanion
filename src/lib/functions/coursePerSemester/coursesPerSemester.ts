import { neoUniversisGet } from '$lib/dataService';
import type {course, localized_course} from '$lib/types/courseType';

// returns the courses for each semester
export async function coursesPerSemester(subjectsJSON: course[] | null | undefined = null) {

	let subjects: course[]
	let registrations: any;
	let courseBySemester: { [key: string]: localized_course[] } = {};

	if (subjectsJSON) {
		subjects = subjectsJSON;
		registrations = (await neoUniversisGet("students/me/Registrations?$expand=classes($expand=courseType($expand=locale),courseClass($expand=course($expand=locale),instructors($expand=instructor($select=InstructorSummary))))&$top=-1&$skip=0&$count=false",{lifetime: 600})).value;
	}
	 
	else {
		subjects = (await neoUniversisGet('students/me/courses?$expand=examPeriod($expand=locales)&$top=-1',{lifetime: 600})).value;
		registrations = (await neoUniversisGet("students/me/Registrations?$expand=classes($expand=courseType($expand=locale),courseClass($expand=course($expand=locale),instructors($expand=instructor($select=InstructorSummary))))&$top=-1&$skip=0&$count=false",{lifetime: 600})).value;
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

	//console.log(subjects)
	
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
			for(const sem of registrations){
                for(const semClass of sem.classes){
					if(semClass.courseClass.course.id == course.course){
						courseBySemester[semester].push({...course, locale: {inLanguage: "en", courseTitle: semClass.courseClass.course.locale.name}});
					}
				}
			}
		}
	}

	console.log(courseBySemester)
	return courseBySemester;

};