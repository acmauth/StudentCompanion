/**
 * @param {number} number
 */

export function gradeString(number) {
    var string = "0.00";

    if(number >= 0 && number <= 10)
        string = String(Math.floor(number * 100) / 100);

    return string;
};
