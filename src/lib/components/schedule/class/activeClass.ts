import { writable } from 'svelte/store';
import type { ClassItem } from './ClassItem';

export const activeClass = writable<ClassItem>();

