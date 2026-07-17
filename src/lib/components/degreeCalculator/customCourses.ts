import { writable } from 'svelte/store';

export const courseAdded = writable(0);

// Load from localStorage if available
const storedCourses = localStorage.getItem('customCourses');
export const customCourses = writable(storedCourses ? JSON.parse(storedCourses) : []);

// Subscribe to store changes and persist them
customCourses.subscribe((value) => {
	localStorage.setItem('customCourses', JSON.stringify(value));
});
