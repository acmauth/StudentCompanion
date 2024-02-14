import type { ClassItem } from "./ClassItem";
import { persisted } from 'svelte-persisted-store'

export const classStore = persisted('classStore', new Array<ClassItem>());