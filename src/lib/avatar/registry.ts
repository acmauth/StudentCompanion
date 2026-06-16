// Registry: the single source of truth the UI reads to render controls.
//
// Option lists are derived directly from the part dictionaries (including any
// merged-in custom vectors), so dropping a new SVG into parts/custom/<cat>/
// makes it appear here automatically.

import type { AvatarConfig, CategoryKey, ColorKey, OptionCategoryKey } from './types';
import { dicts } from './parts';
import { palettes } from './colors';

export interface CategoryDef {
	key: OptionCategoryKey;
	label: string;
	/** Optional categories can be set to `null` (omitted from the avatar). */
	optional: boolean;
	/** Color controls relevant to this category, shown grouped in the UI. */
	colors?: ColorKey[];
}

/** Display + selection order for the controls (also the control grouping). */
export const categories: CategoryDef[] = [
	{ key: 'style', label: 'Background', optional: false, colors: ['background'] },
	{ key: 'top', label: 'Top / Hair', optional: true, colors: ['hair', 'hat'] },
	{ key: 'accessories', label: 'Accessories', optional: true, colors: ['accessories'] },
	{ key: 'facialHair', label: 'Facial Hair', optional: true, colors: ['facialHair'] },
	{ key: 'clothing', label: 'Clothing', optional: false, colors: ['clothes'] },
	{ key: 'clothingGraphic', label: 'Shirt Graphic', optional: false },
	{ key: 'eyes', label: 'Eyes', optional: false },
	{ key: 'eyebrows', label: 'Eyebrows', optional: false },
	{ key: 'nose', label: 'Nose', optional: false },
	{ key: 'mouth', label: 'Mouth', optional: false }
];

/** Available option ids per category (live — reflects custom additions). */
export function optionsFor(key: CategoryKey): string[] {
	return Object.keys(dicts[key]);
}

/** Prettify a camelCase option id into a human label, e.g. `winkWacky` -> `Wink Wacky`. */
export function labelFor(id: string): string {
	return id
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/([a-zA-Z])(\d)/g, '$1 $2')
		.replace(/^./, (c) => c.toUpperCase());
}

const first = (key: CategoryKey): string => optionsFor(key)[0];

function defaultColors(): AvatarConfig['colors'] {
	return {
		skin: palettes.skin[3],
		hair: palettes.hair[1],
		hat: palettes.hat[0],
		clothes: palettes.clothes[1],
		accessories: palettes.accessories[0],
		facialHair: palettes.facialHair[1],
		background: palettes.background[5]
	};
}

export function defaultConfig(): AvatarConfig {
	return {
		style: 'circle',
		clothing: 'shirtCrewNeck',
		clothingGraphic: first('clothingGraphic'),
		mouth: 'smile',
		nose: 'default',
		eyes: 'default',
		eyebrows: 'default',
		top: 'shortFlat',
		facialHair: null,
		accessories: null,
		colors: defaultColors()
	};
}

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickColor = (key: ColorKey): string => pick(palettes[key]);

export function randomConfig(): AvatarConfig {
	return {
		style: pick(['circle', 'default']),
		clothing: pick(optionsFor('clothing')),
		clothingGraphic: pick(optionsFor('clothingGraphic')),
		mouth: pick(optionsFor('mouth')),
		nose: pick(optionsFor('nose')),
		eyes: pick(optionsFor('eyes')),
		eyebrows: pick(optionsFor('eyebrows')),
		top: Math.random() < 0.9 ? pick(optionsFor('top')) : null,
		facialHair: Math.random() < 0.35 ? pick(optionsFor('facialHair')) : null,
		accessories: Math.random() < 0.35 ? pick(optionsFor('accessories')) : null,
		colors: {
			skin: pickColor('skin'),
			hair: pickColor('hair'),
			hat: pickColor('hat'),
			clothes: pickColor('clothes'),
			accessories: pickColor('accessories'),
			facialHair: pickColor('facialHair'),
			background: pickColor('background')
		}
	};
}
