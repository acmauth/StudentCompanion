// Barrel for all part dictionaries, with any custom vectors merged in.
//
// Custom vectors are plain `.svg` files dropped into `parts/custom/<category>/`.
// They are picked up at build time via Vite's glob import and merged into the
// matching category dictionary, so a new file automatically becomes a
// selectable option in the UI with zero wiring. See ./custom/README.md.

import type { CategoryKey, Colors, PartDict, PartFn } from '../types';

import { accessories } from './accessories';
import { base } from './base';
import { clothing } from './clothing';
import { clothingGraphic } from './clothingGraphic';
import { eyebrows } from './eyebrows';
import { eyes } from './eyes';
import { facialHair } from './facialHair';
import { mouth } from './mouth';
import { nose } from './nose';
import { style } from './style';
import { top } from './top';

export const dicts: Record<CategoryKey, PartDict> = {
	style,
	base,
	clothing,
	clothingGraphic,
	mouth,
	nose,
	eyes,
	eyebrows,
	top,
	facialHair,
	accessories
};

/**
 * Turn a raw `<svg>...</svg>` string into a part function. The outer <svg>
 * wrapper is stripped (the compositor provides one), and color tokens such as
 * `{{hair}}` or `{{skin}}` are substituted with the resolved color so custom
 * vectors can participate in theming. Tokens with no matching color are left
 * untouched.
 */
function svgToPart(raw: string): PartFn {
	const inner = raw.replace(/<\?xml[\s\S]*?\?>/g, '').replace(/^[\s\S]*?<svg[^>]*>/i, '').replace(/<\/svg>\s*$/i, '');
	return (_components, colors: Colors) =>
		inner.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
			key in colors ? colors[key as keyof Colors] : match
		);
}

// Eagerly import every custom SVG as a raw string. Keyed by path, e.g.
// './custom/top/my-hat.svg'.
const customFiles = import.meta.glob('./custom/**/*.svg', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

for (const [path, raw] of Object.entries(customFiles)) {
	const match = path.match(/\.\/custom\/([^/]+)\/([^/]+)\.svg$/);
	if (!match) continue;
	const [, category, id] = match;
	const dict = dicts[category as CategoryKey];
	if (!dict) continue;
	dict[id] = svgToPart(raw);
}

export { accessories, base, clothing, clothingGraphic, eyebrows, eyes, facialHair, mouth, nose, style, top };
