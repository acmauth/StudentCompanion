import { writable } from 'svelte/store';
import type { TaskItem } from './TaskItem';

export const activeTask = writable<TaskItem>();

