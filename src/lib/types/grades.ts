import type { course } from './courseType';

/** A passed class inside a registration, as returned by the registrations endpoint. */
export type RegistrationClass = {
	id: string;
	finalGrade: number;
	coefficient: number;
	isPassed: number;
	registration: number;
	course: string;
};

export type Registration = {
	id: number;
	semester: number;
	classes: RegistrationClass[];
};

/** The courses of one semester, plus that semester's average. */
export type SemesterGroup = {
	semesterId: string;
	average: string;
	courses: course[];
};

/** Aggregate averages across every passed course. */
export type AveragesResult = {
	avg: number;
	weighted_avg: number;
	grades: number[];
	ects: number;
};
