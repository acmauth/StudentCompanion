export type HomepageData = {
	givenName: string;
	gender: string;
	numPassedSubjects: number;
	numSubjects: number;
	average: number;
	departmentName: string;
	studyLevel: string;
	actualSemester: number;
	studentStatus: string;
	aem: string;
	apm: string;
	inscriptionYear: string;
	birthDate: string;
	email: string;
	username: string;
	familyName: string;
	locale: string;
};

// Module-level singleton: survives across homepage.svelte mounts/unmounts
// (tab navigation remounts the component) so repeat visits can render
// instantly from the last known data while a background refresh runs.
let cached: HomepageData | null = null;

export function getHomepageCache(): HomepageData | null {
	return cached;
}

export function setHomepageCache(data: HomepageData) {
	cached = data;
}
