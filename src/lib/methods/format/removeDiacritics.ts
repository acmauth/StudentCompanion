export function removeDiacritics(text: string): string {
    return text.normalize('NFD').replace(/\p{Mn}/gu, '').normalize('NFC');
}
