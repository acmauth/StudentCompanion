// Usage: import { getVocativeCase } from './lib/globalFunctions/getVocativeCase';
// Usage: getVocativeCase('Αλέξανδρος');

/*
* This function returns the vocative case of a given name.
* It can handle names with spaces, and it preserves the case of the input.
*
* Names in -ας/-άς/-ης/-ής just drop the final -ς:
*   Κώστας -> Κώστα, Θωμάς -> Θωμά, Γιάννης -> Γιάννη, Ηρακλής -> Ηρακλή
* Names in -ος pick their ending according to where the word is stressed:
*   οξύτονα (last syllable)          -ός -> -έ   Στυλιανός -> Στυλιανέ
*   παροξύτονα (second from the end) -ος -> -ο   Γιώργος -> Γιώργο, Νίκος -> Νίκο
*   προπαροξύτονα (third from the end) -ος -> -ε Αλέξανδρος -> Αλέξανδρε, Λάζαρος -> Λάζαρε
* Names with no accent at all (e.g. written in capitals) fall back to -ο, since
* the stress cannot be detected: ΓΙΩΡΓΟΣ -> ΓΙΩΡΓΟ.
* Names in -ων/-ωρ take -α: Πλάτων -> Πλάτωνα, Έκτωρ -> Έκτορα
*
* Example: getVocativeCase('Αλέξανδρος') returns 'Αλέξανδρε'
* Example: getVocativeCase('Αλέξανδρος Μπακογιάννης') returns 'Αλέξανδρε Μπακογιάννη'
*/
export function getVocativeCase (name: string): string {
    return name
        .split(" ")
        .map(getVocativeCaseSingle)
        .join(" ");
}

/*
* Names that none of the rules below can produce.
* Key is the name in lowercase, value is [how many letters to drop, what to put in their place].
*/
const IRREGULAR: Record<string, [number, string]> = {
    'λέων': [2, 'οντα']     // Λέων -> Λέοντα (not Λέωνα)
};

export function getVocativeCaseSingle (name: string): string {
    const irregular = IRREGULAR[name.toLowerCase()];
    if (irregular) {
        return replaceEnding(name, irregular[0], irregular[1]);
    }

    if (/(ας|άς|ης|ής)$/i.test(name)) {
        return name.slice(0, -1);
    }

    if (/(ος|ός|ων|ών|ωρ|ώρ)$/i.test(name)) {
        return maleInOS(name);
    }

    return name;
}

function maleInOS(name: string): string {
    if (/(ωρ|ώρ)$/i.test(name)) {
        return replaceEnding(name, 2, 'ορα');   // Έκτωρ -> Έκτορα, Νέστωρ -> Νέστορα
    }

    if (/ών$/i.test(name)) {
        return replaceEnding(name, 1, 'ντα');   // Ξενοφών -> Ξενοφώντα
    }

    if (/ων$/i.test(name)) {
        return replaceEnding(name, 1, 'να');    // Πλάτων -> Πλάτωνα, Σόλων -> Σόλωνα
    }

    switch (stressFromEnd(name)) {
        case 1:  return replaceEnding(name, 2, 'έ');    // Στυλιανός -> Στυλιανέ
        case 2:  return replaceEnding(name, 2, 'ο');    // Γιώργος -> Γιώργο
        case 0:  return replaceEnding(name, 2, 'ο');    // no accent to go by: ΓΙΩΡΓΟΣ -> ΓΙΩΡΓΟ
        default: return replaceEnding(name, 2, 'ε');    // Αλέξανδρος -> Αλέξανδρε
    }
}

const VOWELS = 'αεηιουω';
const STRESSED = 'άέήίόύώΐΰ';
const DIAERESIS = 'ϊϋΐΰ';
const DIPHTHONGS = ['αι', 'ει', 'οι', 'υι', 'ου', 'αυ', 'ευ', 'ηυ'];
const PLAIN_VOWEL: Record<string, string> = {
    'ά': 'α', 'έ': 'ε', 'ή': 'η', 'ί': 'ι', 'ό': 'ο', 'ύ': 'υ', 'ώ': 'ω',
    'ΐ': 'ι', 'ΰ': 'υ', 'ϊ': 'ι', 'ϋ': 'υ'
};

/*
* Tells which syllable carries the accent, counting from the end of the word:
* 1 for οξύτονα, 2 for παροξύτονα, 3 (or more) for προπαροξύτονα,
* and 0 when the word carries no accent mark at all.
*/
function stressFromEnd(name: string): number {
    const word = name.toLowerCase();
    let syllables = 0;
    let stressedSyllable = 0;

    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        if (!isVowel(letter)) continue;

        let stressed = STRESSED.includes(letter);
        const next = word[i + 1];
        // A diphthong (ου, αι, ευ, ...) counts as a single syllable, unless the
        // first letter is accented (Μάιος) or the second one carries a diaeresis (Κάιν).
        if (!stressed && next && isVowel(next) && !DIAERESIS.includes(next)
            && DIPHTHONGS.includes(plainVowel(letter) + plainVowel(next))) {
            stressed = STRESSED.includes(next);
            i++;
        }

        syllables++;
        if (stressed) stressedSyllable = syllables;
    }

    return stressedSyllable === 0 ? 0 : syllables - stressedSyllable + 1;
}

function plainVowel(letter: string): string {
    return PLAIN_VOWEL[letter] ?? letter;
}

function isVowel(letter: string): boolean {
    return VOWELS.includes(plainVowel(letter));
}

/*
* Swaps the last letters of a name, keeping the capitalisation of the original
* ending: Γιώργος -> Γιώργο, but ΓΙΩΡΓΟΣ -> ΓΙΩΡΓΟ.
*/
function replaceEnding(name: string, letters: number, ending: string): string {
    const oldEnding = name.slice(-letters);
    const isUpperCase = oldEnding === oldEnding.toUpperCase();
    return name.slice(0, -letters) + (isUpperCase ? ending.toUpperCase() : ending);
}
