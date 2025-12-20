import { neoUniversisGet } from "$lib/dataService";

/**
 * @param { {name: string, id: string, semester_id: number, semester_name: string, grade: number, input_grade: string, coefficient: number, locale: any;}[] } unpassed_courses
 * @param { {based: {grade_sum: number, coefficient: any;}, simple: {grade_sum: number, passed: number;}; } } sums
 */
export async function fetchData(unpassed_courses, sums)
{   
    let not_passed_all_courses = false;


    let courses = (await neoUniversisGet("students/me/courses?$top=-1", {lifetime: 60 * 5})).value;

    let registrations = (await neoUniversisGet("students/me/Registrations?$expand=classes($expand=courseType($expand=locale),courseClass($expand=course($expand=locale),instructors($expand=instructor($select=InstructorSummary))))&$top=-1&$skip=0&$count=false",{lifetime: 600})).value;

    courses.sort((/** @type {{ semester: { id: number; }; }} */ a, /** @type {{ semester: { id: number; }; }} */ b) => a.semester.id - b.semester.id);
    courses = courses.filter((/** @type {{ calculateGrade: number; }} */ course) => course.calculateGrade == 1);

    //console.log(courses)
    for (const course of courses)
    {
        if (course.isPassed === 1)
        {
            sums.based.grade_sum += course.grade * course.coefficient * 10;
            sums.based.coefficient += course.coefficient;

            sums.simple.grade_sum += course.grade * 10;
            sums.simple.passed++;

            continue;
        }
            not_passed_all_courses = true;
            //console.log(course.course)
            for(const reg of registrations){
                for(const semClass of reg.classes){
                    //debug
                    if(semClass.courseClass.course.id == course.course){
                        //console.log(semClass.courseClass.course.id)
                        unpassed_courses.push({ name: course.courseTitle, id: course.id, semester_id: course.semester.id, semester_name: course.semester.name, grade: course.grade, input_grade: "", coefficient: course.coefficient, locale: semClass.courseClass.course.locale}); 
                    }
                }
            }    
        }
    return not_passed_all_courses;
}