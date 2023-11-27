
    import { universisGet } from "$lib/dataService";

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
         totalStudents = 0;

        let courses = await universisGet("students/me/courses?$top=-1");

        let courseExam = "";

        examCode = courses.value;

        for (const exam of examCode) {
            if (exam.course == courseCode) {
                courseExam = exam.gradeExam;
                myGrade = exam.grade;
                break;
            }
        }

        let statistic = await universisGet(
            `students/me/exams/${courseExam}/statistics?$top=-1&`
        );

        console.log(statistic);

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
            } else {
                studentsFailed += exam.total;
            }

            totalGrades += exam.total * exam.examGrade;
        }

        
        // const average = totalGrades / (studentsFailed + studentsPassed);
        const average = Math.round(((totalGrades / (studentsFailed + studentsPassed)) + Number.EPSILON) * 100) / 100;
        const averagePassed = Math.round(((totalPassedGrades / studentsPassed) + Number.EPSILON) * 100) / 100;
        totalStudents = studentsPassed + studentsFailed;

        

        const stats = {
            courseCode: courseCode,
            myGrade: myGrade,
            studentsBetterThanMe: studentsBetterThanMe,
            studentsLikeMe: studentsLikeMe,
            studentsWorseThanMe: studentsWorseThanMe,
            studentsPassed: studentsPassed,
            studentsFailed: studentsFailed,
            average: average*10,
            averagePassed: averagePassed*10,
            totalStudents: totalStudents.toString(),
        };

        return stats;
    }

    
    
