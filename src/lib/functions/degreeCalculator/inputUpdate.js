import { checkPrecision } from './checkPrecision.js';
import { numberCheck } from './numberCheck.js';
import { degreeGradeUpdate } from './degreeGradeUpdate.js';

/**
 * @param { { title: string, id: string, semester_id: number, semester_name: string, grade: number, input_grade: string, coefficient: number; }[] } unpassed_courses
 * @param { { based: { grade_sum:number, coefficient: number}, simple: {grade_sum: number, passed: number}; } } sums
 * @param { { based: {value: number, stringed: string}, simple: {value: number, stringed: string}; } } degree_grade
 */

export function inputUpdate(unpassed_courses, sums, degree_grade){
    let sums_guess = { based: {grade_sum:0, coefficient: sums.based.coefficient}, simple: {grade_sum: 0, passed: sums.simple.passed} };

    for (var course of unpassed_courses)
    {
        if (numberCheck(course))
            continue
        
        course = checkPrecision(course);
        
        sums_guess.based.grade_sum += course.grade * course.coefficient;
        sums_guess.based.coefficient += course.coefficient;

        sums_guess.simple.grade_sum += course.grade;
        sums_guess.simple.passed++;
    }

    degreeGradeUpdate(degree_grade, sums, sums_guess);
}