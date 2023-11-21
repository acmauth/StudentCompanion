import type { Writable } from "svelte/store";
import type { TaskItem } from "./TaskItem";
import { persisted } from 'svelte-persisted-store'

export const taskStore = persisted("taskItem", []);