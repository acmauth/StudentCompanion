import type { SubjectItem } from "./SubjectItem";
import { persisted } from 'svelte-persisted-store'

export const subjectStore = persisted('taskStore', new Array<SubjectItem>());