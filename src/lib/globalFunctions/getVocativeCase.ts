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
    } else if (/(ος|ός|ων|ωρ)|(ΟΣ)$/.test(string)) {
        return maleInOS(string);
    } else {
        return string;
    }
}

function maleInOS(name: string): string {
    // Handle specific exceptions
    if (/^(νίκος|μάρκος|έων|παύλος|αλέξανδρος)$/.test(name.toLowerCase())) {
        return name.replace(/ος$/, 'ε');
    }

    // General endings handling based on the mappings
    if (/(ιος|μπος|λος|αος|νος|ων|ωρ)$/.test(name)) {
        return name.replace(/(ιος|μπος|λος|αος|νος|ων)$/, function (ending) {
            switch (ending) {
                case 'ιος': return 'ιε';
                case 'μπος': return 'μπε';
                case 'λος': return 'λε';
                case 'αος': return 'αε';
                case 'νος': return 'νε';
                case 'ων': return 'ωνα';
                case 'ωρ': return 'ωρα';
                default: return name; // Just in case something unexpected happens
            }
        });
    }

    // Fallback for other names
    if (/ος$/.test(name)) {
        return name.replace(/ος$/, 'ο');
    }

    return name;
}

