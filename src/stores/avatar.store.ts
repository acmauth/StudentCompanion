import CapacitorPersistedStore from "$lib/storage/capacitorPersistedStore";
import {categories, defaultConfig, labelFor, optionsFor, randomConfig} from '$lib/avatar/registry';
import type { AvatarConfig } from "$src/lib/avatar/types";


export const avatarStore = new CapacitorPersistedStore<AvatarConfig>(defaultConfig(), "avatar");
