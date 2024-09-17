export function getSemester (semester: any, lang : string){
    if (typeof semester !== 'number') 
        semester = parseInt(semester);

   if (lang == 'el')
    return semester + 'o';

    if (semester == 1)
        return '1st';
    else if (semester == 2)
        return '2nd';
    else if (semester == 3)
        return '3rd';

   return semester + 'th';
}