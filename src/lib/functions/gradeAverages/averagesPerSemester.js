import { universisGet } from "$lib/dataService";


/**
 * @type {number[]}
 */


export async function averagesPerSemester() {

		let courseBySemester = [];

		let subjects = (await universisGet('students/me/courses?$top=-1')).value;
		courseBySemester = subjects.reduce((/** @type {{ [x: string]: any[]; }} */ acc, /** @type {{ semester: { id: string | number; }; }} */ course) => {
			if (!acc[course.semester.id]) {
				acc[course.semester.id] = [];
			}
			acc[course.semester.id].push(course);
			return acc;
		}, {});



		let averages = [];
		// let ects_list = [];
		// let w_avg = 0;
		// find average for each semester
		for (const semester in courseBySemester) {
			let sum = 0;
			let count = 0;
			// let w_sum = 0;
			
			for (const course of courseBySemester[semester]) {
				if (course.isPassed) {
					sum += course.grade;
					// ects_list[count] = course.ects;
					// w_sum += course.grade * course.ects;
					count++;
				}
			}

			if (count) {
				let avg = Number((sum*10 /count).toFixed(2));
				const s_avg = String(avg);
				averages.push(s_avg);
			}

		}



		return averages;

	}