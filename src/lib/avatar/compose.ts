// Compositor: turns an AvatarConfig into a complete SVG string.
//
// We deliberately reuse the vendored avataaaars `style` + `base` composition,
// which already lays out every sub-part with the correct transforms. We just
// hand it a `components` map built from the current selection instead of
// DiceBear's PRNG-driven picker.

import type { AvatarConfig, CategoryKey, ComponentRef, Components, PartFn } from './types';
import { dicts } from './parts';

function ref(category: CategoryKey, id: string | null | undefined): ComponentRef | undefined {
	if (!id) return undefined;
	const value: PartFn | undefined = dicts[category][id];
	return value ? { name: id, value } : undefined;
}

/** Build the `components` map the part functions expect from a selection. */
export function buildComponents(config: AvatarConfig): Components {
	return {
		style: ref('style', config.style) ?? ref('style', 'default'),
		base: ref('base', 'default'),
		clothing: ref('clothing', config.clothing),
		clothingGraphic: ref('clothingGraphic', config.clothingGraphic),
		mouth: ref('mouth', config.mouth),
		nose: ref('nose', config.nose),
		eyes: ref('eyes', config.eyes),
		eyebrows: ref('eyebrows', config.eyebrows),
		top: ref('top', config.top),
		facialHair: ref('facialHair', config.facialHair),
		accessories: ref('accessories', config.accessories)
	};
}

let instanceCounter = 0;

/**
 * Suffix every `id` in a composed avatar (and every reference to it) with a
 * per-render token.
 *
 * The generated part files hardcode ids such as `styleCircle-a`. Because these
 * SVGs are inlined into the light DOM, those ids are document-global: with more
 * than one avatar mounted the duplicates collide and `url(#…)` resolves to
 * whichever copy comes first in document order. That copy then silently stops
 * masking the *other* avatars the moment it is hidden — e.g. when Ionic marks
 * the previous page `.ion-page-hidden` (`display: none`) at the end of a push
 * transition, which drops the mask's layout object and invalidates the
 * reference, leaving the body rendered unmasked.
 */
function namespaceIds(svg: string): string {
	const ids = new Set<string>();
	for (const [, id] of svg.matchAll(/\sid="([^"]+)"/g)) ids.add(id);
	if (ids.size === 0) return svg;

	const suffix = `-i${++instanceCounter}`;

	let out = svg;
	for (const id of ids) {
		const literal = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		// Each pattern is anchored on the reference's closing delimiter, so an id
		// that is a prefix of another id is never partially rewritten.
		out = out
			.replace(new RegExp(`(\\sid=")${literal}(")`, 'g'), `$1${id}${suffix}$2`)
			.replace(new RegExp(`(url\\(#)${literal}(\\))`, 'g'), `$1${id}${suffix}$2`)
			.replace(new RegExp(`((?:xlink:)?href="#)${literal}(")`, 'g'), `$1${id}${suffix}$2`);
	}
	return out;
}

/** Render a full `<svg>` string for the given config. */
export function composeAvatar(config: AvatarConfig): string {
	const components = buildComponents(config);
	const styleComponent = components.style ?? ref('style', 'default');
	const inner = styleComponent ? styleComponent.value(components, config.colors) : '';

	return namespaceIds(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280" fill="none" shape-rendering="auto">` +
			`<g transform="translate(8)">${inner}</g>` +
			`</svg>`
	);
}
