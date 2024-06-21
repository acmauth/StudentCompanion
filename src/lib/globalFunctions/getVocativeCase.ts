// Usage: import { getVocativeCase } from './lib/globalFunctions/getVocativeCase';
// Usage: getVocativeCase('Αλέξανδρος');

/*
* This function returns the vocative case of a given name.
* It can handle names with spaces.
* It can handle names with the following endings:
* -ας, -άς, -ης, -ής, -ος, -ός, -γος, -γός, -άνος, -ανος, -ανός, -τος, -τός
* -ΑΣ, -ΗΣ, -ΟΣ, -ΓΟΣ, -ΓΌΣ, -ΆΝΟΣ, -ΑΝΟΣ, -ΑΝΌΣ, -ΤΟΣ, -ΤΌΣ
* It returns the name in lowercase.
* Example: getVocativeCase('Αλέξανδρος') returns 'αλέξανδρε'
* Example: getVocativeCase('Αλέξανδρος Μπακογιάννης') returns 'αλέξανδρε μπακογιάννη'
*/
export function getVocativeCase (name: string): string {
    if (name.includes(" ")) {
        const names: string[] = name.split(" ");
        let vocatives: string[] = [];
        for (name of names) {
            vocatives.push(getVocativeCaseSingle(name));
        }
        return vocatives.join(" ");
    } else {
        return getVocativeCaseSingle(name);
    }
}

export function getVocativeCaseSingle (string: string): string {
    if (/(ας|άς)|(ης|ής)|(ΑΣ)|(ΗΣ)$/.test(string)) {
        return string.slice(0, -1);
    } else if (/(ος|ός)|(ΟΣ)$/.test(string)) {
        return maleInOS(string);
    } else {
        return string;
    }
}

function maleInOS(string: string): string {
    if (/(γος|γός)|(άνος|ανος|ανός)|(τος|τός)|(ΓΟΣ)|(ΑΝΟΣ)|(ΤΟΣ)$/.test(string)) {
        return string.slice(0, -1);
    } else {
        if (/ΟΣ$/.test(string)) {
            return string.replace(/ΟΣ$/, 'Ε');
        } else {
            return string.replace(/(ός|ος)$/, 'ε');
        }
    }
}
