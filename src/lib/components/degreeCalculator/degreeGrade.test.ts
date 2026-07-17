import { describe, it, expect } from 'vitest';
import { computeDegreeGrade, normalizeGradeInput, gradeString } from './degreeGrade';
import type { GradeEntry, PassedSums } from './degreeGrade';

// These expectations were captured from the original DOM-driven
// numberCheck/checkPrecision pair, so the quirks below are intentional:
// two-digit entries carry an implied decimal, and >= 100 is rejected outright.
describe('normalizeGradeInput', () => {
	it('clears an empty field', () => {
		expect(normalizeGradeInput('', '')).toEqual({ value: '', grade: null });
	});

	it('reads a two digit entry as having an implied decimal', () => {
		expect(normalizeGradeInput('85', '')).toEqual({ value: '8.5', grade: 8.5 });
		expect(normalizeGradeInput('80', '')).toEqual({ value: '8.0', grade: 8 });
		expect(normalizeGradeInput('11', '')).toEqual({ value: '1.1', grade: 1.1 });
	});

	it('keeps a plain in-range grade as typed', () => {
		expect(normalizeGradeInput('8.5', '')).toEqual({ value: '8.5', grade: 8.5 });
		expect(normalizeGradeInput('5', '')).toEqual({ value: '5', grade: 5 });
		expect(normalizeGradeInput('10', '')).toEqual({ value: '10', grade: 10 });
	});

	it('caps at two decimal places', () => {
		expect(normalizeGradeInput('8.555', '')).toEqual({ value: '8.55', grade: 8.55 });
		expect(normalizeGradeInput('9.99', '')).toEqual({ value: '9.99', grade: 9.99 });
	});

	it('displays "00" as "0.0"', () => {
		expect(normalizeGradeInput('00', '')).toEqual({ value: '0.0', grade: 0 });
	});

	it('reverts unparseable or out of range input to the last good value', () => {
		expect(normalizeGradeInput('abc', '8.5')).toEqual({ value: '8.5', grade: 8.5 });
		expect(normalizeGradeInput('100', '8.5')).toEqual({ value: '8.5', grade: 8.5 });
		expect(normalizeGradeInput('-5', '8.5')).toEqual({ value: '8.5', grade: 8.5 });
	});

	it('clears rejected input when there is nothing to revert to', () => {
		expect(normalizeGradeInput('abc', '')).toEqual({ value: '', grade: null });
		expect(normalizeGradeInput('100', '')).toEqual({ value: '', grade: null });
		expect(normalizeGradeInput('-5', '')).toEqual({ value: '', grade: null });
	});
});

describe('gradeString', () => {
	it('formats a grade inside the scale', () => {
		expect(gradeString(8.456)).toBe('8.46');
		expect(gradeString(0)).toBe('0.00');
		expect(gradeString(10)).toBe('10.00');
	});

	it('falls back to 0.00 outside the scale, including NaN', () => {
		expect(gradeString(NaN)).toBe('0.00');
		expect(gradeString(Infinity)).toBe('0.00');
		expect(gradeString(-1)).toBe('0.00');
	});
});

function entry(gradeNumber: number | null, coefficient: number | string): GradeEntry {
	return { grade: '', lastGrade: '', gradeNumber, coefficient };
}

describe('computeDegreeGrade', () => {
	// Two passed courses: grades 8 and 6 (the API reports them on a 0-1 scale),
	// coefficients 5 and 5.
	const passed: PassedSums = {
		based: { grade_sum: 8 * 5 + 6 * 5, coefficient: 10 },
		simple: { grade_sum: 8 + 6, passed: 2 }
	};

	it('reports the passed courses alone when nothing is predicted', () => {
		const result = computeDegreeGrade(passed, []);
		expect(result.based.stringed).toBe('7.00');
		expect(result.simple.stringed).toBe('7.00');
	});

	it('folds a predicted grade into both averages', () => {
		const result = computeDegreeGrade(passed, [entry(10, 10)]);
		// weighted: (10*10 + 70) / (10 + 10) = 8.5
		expect(result.based.stringed).toBe('8.50');
		// simple: (10 + 14) / 3 = 8
		expect(result.simple.stringed).toBe('8.00');
	});

	it('ignores empty and failing predictions', () => {
		expect(computeDegreeGrade(passed, [entry(null, 10)])).toEqual(
			computeDegreeGrade(passed, [])
		);
		expect(computeDegreeGrade(passed, [entry(4.99, 10)])).toEqual(
			computeDegreeGrade(passed, [])
		);
	});

	it('counts a course with no coefficient toward the simple average only', () => {
		const result = computeDegreeGrade(passed, [entry(10, '')]);
		// weighted is unchanged: no coefficient to weight by
		expect(result.based.stringed).toBe('7.00');
		// simple still gains the course: (10 + 14) / 3 = 8
		expect(result.simple.stringed).toBe('8.00');
	});

	it('reports 0.00 rather than NaN when there is nothing to average', () => {
		const empty: PassedSums = {
			based: { grade_sum: 0, coefficient: 0 },
			simple: { grade_sum: 0, passed: 0 }
		};
		expect(computeDegreeGrade(empty, []).based.stringed).toBe('0.00');
		expect(computeDegreeGrade(empty, []).simple.stringed).toBe('0.00');
	});
});
