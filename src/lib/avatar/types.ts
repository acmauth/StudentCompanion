// Core types for the avatar registry/compositor.
//
// A "part" is a function returning a fragment of inline SVG markup. It receives
// the full set of selected components (so a part can compose nested parts, e.g.
// the base composes everything, a graphic shirt composes its graphic) and the
// resolved color set. This mirrors the shape of the vendored avataaaars parts.

export type ColorKey =
	| 'skin'
	| 'hair'
	| 'hat'
	| 'clothes'
	| 'accessories'
	| 'facialHair'
	| 'background';

export type Colors = Record<ColorKey, string>;

export type PartFn = (components: Components, colors: Colors) => string;

/** A category's option map: option id -> render function. */
export type PartDict = Record<string, PartFn>;

/** A selected component: its option id (`name`) and render function (`value`). */
export interface ComponentRef {
	name: string;
	value: PartFn;
}

/** Category keys that can be selected/composed into an avatar. */
export type CategoryKey =
	| 'style'
	| 'base'
	| 'clothing'
	| 'clothingGraphic'
	| 'mouth'
	| 'nose'
	| 'eyes'
	| 'eyebrows'
	| 'top'
	| 'facialHair'
	| 'accessories';

/** The map of currently selected components passed to every part fn. */
export type Components = Partial<Record<CategoryKey, ComponentRef | undefined>>;

/**
 * Categories the user selects in the UI. Excludes `base`, which is implicit
 * (always `default`) and not part of the config. Each maps to a field on
 * `AvatarConfig`.
 */
export type OptionCategoryKey = Exclude<CategoryKey, 'base'>;

/**
 * A complete avatar selection. Each field is an option id from the matching
 * category. Optional categories (`top`, `facialHair`, `accessories`) may be
 * `null` to omit them entirely.
 */
export interface AvatarConfig {
	style: string;
	clothing: string;
	clothingGraphic: string;
	mouth: string;
	nose: string;
	eyes: string;
	eyebrows: string;
	top: string | null;
	facialHair: string | null;
	accessories: string | null;
	colors: Colors;
}
