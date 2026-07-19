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

/** Render a full `<svg>` string for the given config. */
export function composeAvatar(config: AvatarConfig): string {
	const components = buildComponents(config);
	const styleComponent = components.style ?? ref('style', 'default');
	const inner = styleComponent ? styleComponent.value(components, config.colors) : '';

	return (
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280" fill="none" shape-rendering="auto">` +
		`<g transform="translate(8)">${inner}</g>` +
		`</svg>`
	);
}
