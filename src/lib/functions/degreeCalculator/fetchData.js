import { neoUniversisGet } from "$lib/dataService";

/**
 * @param { {title: any, id: any, semester_id: number, semester_name: string, grade: any, input_grade: string, ects: any, name: string;}[] } unpassed_courses
 * @param { {ects: {grade_sum: number, ect: any;}, simple: {grade_sum: number, passed: number;}; } } sums
 */
export async function fetchData(unpassed_courses, sums)
{   
    let not_passed_all_courses = false;


    let courses = (await neoUniversisGet("students/me/courses?$top=-1", {lifetime: 60 * 5})).value;
    

    courses.sort((/** @type {{ semester: { id: number; }; }} */ a, /** @type {{ semester: { id: number; }; }} */ b) => a.semester.id - b.semester.id);
    courses = courses.filter((/** @type {{ calculateGrade: number; }} */ course) => course.calculateGrade == 1);

    for (const course of courses)
    {
        if (course.isPassed == 1)
        {
            sums.ects.grade_sum += course.grade * course.ects * 10;
            sums.ects.ect += course.ects;

            sums.simple.grade_sum += course.grade * 10;
            sums.simple.passed++;

            continue;
        }
            not_passed_all_courses = true;
            unpassed_courses.push({ title: course.courseTitle, id: course.id, semester_id: course.semester.id, semester_name: course.semester.name, grade: course.grade, input_grade: "", ects: course.ects, name: course.semester.name}); 
    }

    return not_passed_all_courses;
}