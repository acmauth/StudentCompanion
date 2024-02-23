import { gradeString } from  './gradeString.js';

/**
 * @param {any} degree_grade
 * @param {any} sums
 * @param {any} sums_two
 */

export function degreeGradeUpdate(degree_grade, sums, sums_two) {
    degree_grade.ects.value = ((sums_two.ects.grade_sum+sums.ects.grade_sum) / sums_two.ects.ect_all);
    degree_grade.ects.stringed = gradeString(degree_grade.ects.value);

    degree_grade.simple.value = ((sums_two.simple.grade_sum+sums.simple.grade_sum) / sums_two.simple.passed_all);
    degree_grade.simple.stringed = gradeString(degree_grade.simple.value);
    
    // var a = document.getElementById("ect-grade-text");
    // a?.innerHTML = degree_grade.simple.stringed;

    return degree_grade;
};