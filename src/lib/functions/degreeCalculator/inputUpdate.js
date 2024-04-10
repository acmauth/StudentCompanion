import { checkPrecision } from './checkPrecision.js';
import { numberCheck } from './numberCheck.js';
import { degreeGradeUpdate } from './degreeGradeUpdate.js';

/**
 * @param { any } unpassed_courses
 * @param { { ects: { ect: any; }, simple: { passed: any; }; } } sums
 * @param { any } degree_grade
 */

export function inputUpdate(unpassed_courses, sums, degree_grade){
    let sums_guess = { ects: {grade_sum:0, ect_all: sums.ects.ect}, simple: {grade_sum: 0, passed_all: sums.simple.passed} };

    for (var course of unpassed_courses)
    {
        const input_element = document.getElementById(course.id);
            if (input_element != null)
                input_element.style.borderColor = "#ccc";

        if (numberCheck(course))
            continue
        
        course = checkPrecision(course);

        if (course.grade < 5 && input_element != null)
        {
            input_element.style.borderColor = "red";
            continue;
        }
        
        sums_guess.ects.grade_sum += course.grade * course.ects;
        sums_guess.ects.ect_all += course.ects;

        sums_guess.simple.grade_sum += course.grade;
        sums_guess.simple.passed_all++;
    }

    degreeGradeUpdate(degree_grade, sums, sums_guess);
}