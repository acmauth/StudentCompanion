import { writable } from 'svelte/store';
import { getOrdinalSuffix } from '$methods/format/ordinal';

export const flipped = writable(false);

export function getSemester(semester: any, lang: string) {
	if (typeof semester !== 'number') semester = parseInt(semester);

	if (lang == 'el') return semester + 'o';

	return getOrdinalSuffix(semester);
}
