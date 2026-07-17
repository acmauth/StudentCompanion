import { writable } from 'svelte/store';
import { normalizeGradeInput } from './degreeGrade';
import type { GradeEntry } from './degreeGrade';

export type CustomCourse = GradeEntry & {
	id: number;
	title: string;
};

/**
 * Courses saved before lastGrade/gradeNumber existed only stored `grade`, and
 * stored it as a number once it had been through the old input handling. Read
 * that back through the mask so restored courses land in a consistent state.
 */
function restore(stored: string | null): CustomCourse[] {
	if (!stored) return [];

	let parsed: any[];
	try {
		parsed = JSON.parse(stored);
	} catch {
		return [];
	}
	if (!Array.isArray(parsed)) return [];

	return parsed.map((course) => {
		const { value, grade } = normalizeGradeInput(String(course?.grade ?? ''), '');

		return {
			id: Number(course?.id) || 0,
			title: course?.title ?? '',
			coefficient: course?.coefficient ?? '',
			grade: value,
			lastGrade: value,
			gradeNumber: grade
		};
	});
}

export const customCourses = writable<CustomCourse[]>(restore(localStorage.getItem('customCourses')));

// Subscribe to store changes and persist them
customCourses.subscribe((value) => {
	localStorage.setItem('customCourses', JSON.stringify(value));
});
