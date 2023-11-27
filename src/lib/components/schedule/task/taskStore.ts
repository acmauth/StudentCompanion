import type { TaskItem } from "./TaskItem";
import { persisted } from 'svelte-persisted-store'

export const taskStore = persisted('taskStore', new Array<TaskItem>());