// @ts-nocheck
/**
 * @param { { title: string, id:string, semester_id: number, semester_name: string grade: number, input_grade: string, coefficient: number, name: string; } } course
 */

export function numberCheck(course) {
    var id = String(course.id);
    const input_element = document.getElementById(id);

    if (input_element == null || input_element.value.length === 0)
    {
        course.input_grade = "";
        input_element.value = "";
        
        return 1;  
    }

    var grade = +(input_element.value);

    if (isNaN(grade) || grade != 1 && grade < 5 || grade >= 100)
    {
        if (course.input_grade == "")
        {
            input_element.value = "";
            return 1;
        }

        input_element.value = course.input_grade;
        grade = parseFloat(course.input_grade);  
    }    

    if (grade == 1)
        grade = 10;

    var temp = "";

    if (grade > 10)
    {  
        if (grade / 10 >= 10)
            grade = parseFloat(course.input_grade);  
        else
        {
            if (grade%10 == 0)
                temp = ".0";
            
            grade /= 10;
        }

        input_element.value = String(grade) + temp;   
    } 

    if (grade == 10)
        input_element.value = "10";
    
    course.grade = grade;
    
    return 0;
};