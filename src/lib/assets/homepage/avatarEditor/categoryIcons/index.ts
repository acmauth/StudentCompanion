const svgs = import.meta.glob('./*.svg', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

export const eyes = svgs['./eyes.svg'];
export const mouth = svgs['./mouth.svg'];
export const accessories = svgs['./accessories.svg'];
export const beard = svgs['./beard.svg'];
export const eyebrows = svgs['./eyebrows.svg'];
export const hair = svgs['./hair.svg'];
