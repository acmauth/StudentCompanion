// @ts-nocheck
/**
 * @param { { title: string, id:string, semester_id: number, semester_name: string, grade: number, input_grade: string, coefficient: number; } } course
 */

export function checkPrecision(course) {
    var id = String(course.id);
    const input_element = document.getElementById(id);

    if (input_element == null)
        return course;

    var grade_string = input_element.value;

    if (grade_string.length >= 5) // 2 digit percision max.
    {
        input_element.value = grade_string.slice(0, 4);
        course.grade = parseFloat(input_element.value);
    }

    if (grade_string == "00")
        input_element.value = "0.0";

    course.input_grade = input_element.value;

    return course;
};