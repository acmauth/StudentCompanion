import CapacitorPersistedStore from "$services/storage/persisted/CapacitorPersistedStore";
import {categories, defaultConfig, labelFor, optionsFor, randomConfig} from './registry';
import type { AvatarConfig } from "./types";


export const avatarStore = new CapacitorPersistedStore<AvatarConfig>(defaultConfig(), "avatar");
