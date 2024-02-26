export function getVocativeCase (string: string): string {
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