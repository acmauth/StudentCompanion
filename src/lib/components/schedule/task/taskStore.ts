import type { TaskItem } from "./TaskItem";
import CapacitorPersistedStore from "$lib/storage/capacitorPersistedStore";

export const taskStore = new CapacitorPersistedStore(new Array<TaskItem>(), 'taskStore');