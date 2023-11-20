import type { Writable } from "svelte/store";
import type { TaskItem } from "./TaskItem";
import { persisted } from 'svelte-local-storage-store'

export const taskStore: Writable<TaskItem[]> = persisted("taskItem", []);