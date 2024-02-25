import { checkPrecision } from './checkPrecision.js';
import { numberCheck } from './numberCheck.js';
import { degreeGradeUpdate } from './degreeGradeUpdate.js';

/**
 * @param {any} unpassed_courses
 * @param {{ ects: { ect: any; }; simple: { passed: any; }; }} sums
 * @param {any} degree_grade
 */

export function inputUpdate(unpassed_courses, sums, degree_grade){
    let sums_guess = { ects: {grade_sum:0, ect_all: sums.ects.ect}, simple: {grade_sum: 0, passed_all: sums.simple.passed} };

    for (var course of unpassed_courses)
    {
        if (numberCheck(course))
            continue
        
        course = checkPrecision(course);
        
        sums_guess.ects.grade_sum += course.grade * course.ects;
        sums_guess.ects.ect_all += course.ects;

        sums_guess.simple.grade_sum += course.grade;
        sums_guess.simple.passed_all++;
    }

    degreeGradeUpdate(degree_grade, sums, sums_guess);
    console.log(degree_grade.ects.stringed);
}