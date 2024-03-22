import { neoUniversisGet } from "$lib/dataService";
import type { course } from "$lib/types/courseType";
import { coursesPerSemester } from "../coursePerSemester/coursesPerSemester";

export async function averagesPerSemester(subjectsJSON: course[] | null | undefined = null) {

		let courseBySemester: { [key: string]: course[] } = {};
		let subjects: course[] = [];
		if (subjectsJSON) {
			subjects = subjectsJSON;
		}
		else {
			 subjects = (await neoUniversisGet('students/me/courses?$top=-1',{lifetime: 600})).value;
		}


		courseBySemester = await coursesPerSemester(subjects);


		let averages: { [key: string]: string } = {};

		// find average for each semester
		for (const semester in courseBySemester) {
			let sum = 0;
			let count = 0;


			for (const course of courseBySemester[semester]) {
				if (course.isPassed && course.calculateUnits && course.parentCourse == null) {
					sum += course.grade;
					count++;
				}
			}

			if (count) {
				let avg = Number(((sum*10 /count).toFixed(3))).toFixed(2);
				const s_avg = String(avg);
				averages[semester] = s_avg;
			}

		}
		return averages;
	}