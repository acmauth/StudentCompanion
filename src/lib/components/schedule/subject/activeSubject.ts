import { writable } from 'svelte/store';
import type { SubjectItem } from './SubjectItem';

export const activeSubject = writable<SubjectItem>();

