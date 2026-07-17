/** A grade is entered on a 0-10 scale and must reach this to count. */
export const PASS_THRESHOLD = 5;

/** Running totals over the courses the student has already passed. */
export type PassedSums = {
	based: { grade_sum: number; coefficient: number };
	simple: { grade_sum: number; passed: number };
};

export type DegreeGrade = {
	based: { value: number; stringed: string };
	simple: { value: number; stringed: string };
};

/** Anything the student can type a predicted grade into. */
export type GradeEntry = {
	/** Text currently shown in the input. */
	grade: string;
	/** Last text that normalized cleanly, used to revert rejected input. */
	lastGrade: string;
	/** Numeric form of lastGrade, or null when the field is empty. */
	gradeNumber: number | null;
	coefficient: number | string;
};

export type NormalizedGrade = { value: string; grade: number | null };

/**
 * Input masking for a predicted grade, preserved verbatim from the original
 * numberCheck/checkPrecision pair:
 *
 *   - an empty field, or a rejected entry with nothing to fall back to, clears
 *   - anything unparseable or outside [0, 100) reverts to the last good value
 *   - a value above 10 is read as having an implied decimal: 85 -> 8.5, 80 -> 8.0
 *   - two decimal places at most: 8.555 -> 8.55
 *   - "00" displays as "0.0"
 *
 * A null grade means "don't count this course"; a grade below PASS_THRESHOLD is
 * counted as failing and shown as invalid.
 */
export function normalizeGradeInput(raw: string, previous: string): NormalizedGrade {
	if (raw.length === 0) return { value: '', grade: null };

	let grade = Number(raw);
	let value = raw;

	if (isNaN(grade) || grade < 0 || grade >= 100) {
		if (previous === '') return { value: '', grade: null };
		value = previous;
		grade = parseFloat(previous);
	}

	if (grade > 10) {
		const trailingZero = grade % 10 === 0 ? '.0' : '';
		grade /= 10;
		value = String(grade) + trailingZero;
	}

	if (grade === 10) value = '10';

	if (value.length >= 5) {
		value = value.slice(0, 4);
		grade = parseFloat(value);
	}

	if (value === '00') value = '0.0';

	return { value, grade };
}

/** Applies the mask to an entry in place, after its text has been edited. */
export function applyGradeInput(entry: GradeEntry) {
	const { value, grade } = normalizeGradeInput(String(entry.grade ?? ''), entry.lastGrade ?? '');
	entry.grade = value;
	entry.lastGrade = value;
	entry.gradeNumber = grade;
}

/** Clears an entry's grade, as clicking or focusing its input does. */
export function clearGradeInput(entry: GradeEntry) {
	entry.grade = '';
	entry.lastGrade = '';
	entry.gradeNumber = null;
}

/** A grade that was entered but doesn't pass. Empty fields are not failing. */
export function isFailing(entry: GradeEntry): boolean {
	return entry.gradeNumber !== null && entry.gradeNumber < PASS_THRESHOLD;
}

/** Coefficients are whole numbers of at most two digits. */
export function normalizeCoefficient(coefficient: number | string): string {
	if (!coefficient) return String(coefficient ?? '');
	return String(coefficient).replace(/\D/g, '').slice(0, 2);
}

export function gradeString(value: number): string {
	return value >= 0 && value <= 10 ? value.toFixed(2) : '0.00';
}

/**
 * Degree grade the student would end up with if every entered prediction held.
 * Entries that are empty or failing are left out, exactly as before.
 */
export function computeDegreeGrade(passed: PassedSums, entries: GradeEntry[]): DegreeGrade {
	let basedSum = 0;
	let basedCoefficient = passed.based.coefficient;
	let simpleSum = 0;
	let simplePassed = passed.simple.passed;

	for (const entry of entries) {
		if (entry.gradeNumber === null || entry.gradeNumber < PASS_THRESHOLD) continue;

		const coefficient = Number(entry.coefficient) || 0;

		basedSum += entry.gradeNumber * coefficient;
		basedCoefficient += coefficient;
		simpleSum += entry.gradeNumber;
		simplePassed++;
	}

	const based = (basedSum + passed.based.grade_sum) / basedCoefficient;
	const simple = (simpleSum + passed.simple.grade_sum) / simplePassed;

	return {
		based: { value: based, stringed: gradeString(based) },
		simple: { value: simple, stringed: gradeString(simple) }
	};
}
