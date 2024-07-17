/**
 * @param {number} number
 */

export function gradeString(number) {
    var string = "0.00";

    if(number >= 0 && number <= 10)
        string = String(number.toFixed(2));
        

    return string;
};
