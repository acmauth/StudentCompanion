import type { ClassItem } from "./ClassItem";
import CapacitorPersistedStore from "$lib/storage/capacitorPersistedStore";

export const classStore = new CapacitorPersistedStore(new Array<ClassItem>(), 'classStore');
