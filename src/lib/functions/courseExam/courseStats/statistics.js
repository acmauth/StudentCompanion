import { neoUniversisGet } from '$lib/dataService';

let examCode;
let myGrade;
let studentsBetterThanMe;
let studentsLikeMe;
let studentsWorseThanMe;
let studentsPassed;
let studentsFailed;
let totalGrades;
let totalPassedGrades;
let totalStudents;
let gradesCount;
let topPercent;

/**
 * @param {any} courseCode
 */
export async function statistics(courseCode) {
	examCode = [];
	myGrade = 0;
	studentsBetterThanMe = 0;
	studentsLikeMe = 0;
	studentsWorseThanMe = 0;
	studentsPassed = 0;
	studentsFailed = 0;
	totalGrades = 0;
	totalPassedGrades = 0;
	topPercent = false;
	totalStudents = 0;
	gradesCount = {
		0: 0,
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0,
		10: 0
	};

    try {

	let courses = await neoUniversisGet('students/me/courses?$top=-1');

	let courseExam = '';

	examCode = courses.value;

	for (const exam of examCode) {
		if (exam.course == courseCode) {
			courseExam = exam.gradeExam;
			myGrade = exam.grade;
			break;
		}
	}

	let statistic = await neoUniversisGet(`students/me/exams/${courseExam}/statistics?$top=-1&`,{lifetime: 600});

	let passedGrades = [];

	for (const exam of statistic) {
		if (myGrade > exam.examGrade) {
			studentsWorseThanMe += exam.total;
		} else if (myGrade < exam.examGrade) {
			studentsBetterThanMe += exam.total;
		} else {
			studentsLikeMe += exam.total;
		}

		if (exam.examGrade >= 0.5) {
			studentsPassed += exam.total;
			totalPassedGrades += exam.total * exam.examGrade;
			passedGrades.push(exam.examGrade);
		} else {
			studentsFailed += exam.total;
		}
		// @ts-ignore
		let grade = parseInt(exam.examGrade * 10);
		// @ts-ignore
		gradesCount[grade.toString()] += exam.total;
		totalGrades += exam.total * exam.examGrade;
	}

	const average =
		Math.round((totalGrades / (studentsFailed + studentsPassed) + Number.EPSILON) * 100) / 100;
	const averagePassed =
		Math.round((totalPassedGrades / studentsPassed + Number.EPSILON) * 100) / 100;
	totalStudents = studentsPassed + studentsFailed;

	myGrade *= 10;
	myGrade = Number.isInteger(myGrade) ? myGrade : Number((myGrade).toFixed(3)).toFixed(1);

	if (passedGrades.length > 0) {
		passedGrades.sort((a, b) => b - a);

		const topPercentCount = Math.ceil(passedGrades.length * 0.1);
		const topPercentGrades = passedGrades.slice(0, topPercentCount);

		topPercent = topPercentGrades.includes(myGrade / 10); 
	}

	const stats = {
		courseCode: courseCode,
		myGrade: myGrade,
		studentsBetterThanMe: studentsBetterThanMe,
		studentsLikeMe: studentsLikeMe,
		studentsWorseThanMe: studentsWorseThanMe,
		studentsPassed: studentsPassed,
		studentsFailed: studentsFailed,
		average: average * 10,
		averagePassed: averagePassed * 10,
		totalStudents: totalStudents.toString(),
		gradesCount: gradesCount,
		topPercent: topPercent
	};

	return stats;
    }
    catch (error) {
        console.error("An error occurred:", error);
        return error;
    }
}