import { fetchData } from './fetchData.js';
import { degreeGradeUpdate } from './degreeGradeUpdate.js';

/**
 * @param { { title: any, id: any, semester_id: number, semester_name: string, grade: any, input_grade: string, coefficient: any, name: string; }[] } unpassed_courses
 * @param { { coefficients: any, simple: any; } } sums
 * @param { any } degree_grade
 */
export async function main(unpassed_courses, sums, degree_grade) {
    let not_passed_all_courses = await fetchData(unpassed_courses, sums); 

    let sums_temp = { coefficients: {grade_sum:0, coefficient_all: sums.coefficients.coefficient}, simple: {grade_sum: 0, passed_all: sums.simple.passed} };
    degreeGradeUpdate(degree_grade, sums, sums_temp);

    return not_passed_all_courses;
}; 