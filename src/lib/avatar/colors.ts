// Color palettes, lifted from the avataaaars schema. Stored as `#rrggbb`
// strings so they can be dropped straight into <input type="color"> and into
// the SVG `fill` attributes that the parts emit.

import type { ColorKey } from './types';

const hex = (codes: string[]): string[] => codes.map((c) => `#${c}`);

export const palettes: Record<ColorKey, string[]> = {
	skin: hex(['614335', 'd08b5b', 'ae5d29', 'edb98a', 'ffdbb4', 'fd9841', 'f8d25c']),
	hair: hex(['a55728', '2c1b18', 'b58143', 'd6b370', '724133', '4a312c', 'f59797', 'ecdcbf', 'c93305', 'e8e1e1']),
	hat: hex(['262e33', '65c9ff', '5199e4', '25557c', 'e6e6e6', '929598', '3c4f5c', 'b1e2ff', 'a7ffc4', 'ffdeb5', 'ffafb9', 'ffffb1', 'ff488e', 'ff5c5c', 'ffffff']),
	clothes: hex(['262e33', '65c9ff', '5199e4', '25557c', 'e6e6e6', '929598', '3c4f5c', 'b1e2ff', 'a7ffc4', 'ffafb9', 'ffffb1', 'ff488e', 'ff5c5c', 'ffffff']),
	accessories: hex(['262e33', '65c9ff', '5199e4', '25557c', 'e6e6e6', '929598', '3c4f5c', 'b1e2ff', 'a7ffc4', 'ffdeb5', 'ffafb9', 'ffffb1', 'ff488e', 'ff5c5c', 'ffffff']),
	facialHair: hex(['a55728', '2c1b18', 'b58143', 'd6b370', '724133', '4a312c', 'f59797', 'ecdcbf', 'c93305', 'e8e1e1']),
	// Background only renders with the `circle` style; the `default` style is transparent.
	background: hex(['32b7ff', '95d5ed', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'])
};

export const colorKeys = Object.keys(palettes) as ColorKey[];
