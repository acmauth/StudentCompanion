import { get } from 'svelte/store';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

import { composeAvatar } from '$lib/avatar/compose';
import { avatarStore } from '$stores/avatar.store';
import type { AvatarConfig } from '$lib/avatar/types';
import logoWhite from '$lib/assets/Logo_full_white.png';

const WIDTH = 1080;
const HEIGHT = 1920;

const AESTHETICS = {
		perfect: {
			base: ['#10deca'],
			avatar: {
				mouth: 'tongue',
				eyes: 'hearts',
				eyebrows: 'raisedExcited'
			},
			gauge: {
				fill: '#0e6b0e',
				track: '#e3f2e3'
			}
		},
		passed: {
			base: ['#198de6'],
			avatar: {
				mouth: 'smile',
				eyes: 'happy',
				eyebrows: 'raisedExcited'
			},
			gauge: {
				fill: '#0e6b0e',
				track: '#e3f2e3'
			}
		},
		failed: {
			base: ['#5b21c7'],
			avatar: {
				mouth: 'concerned',
				eyes: 'eyeRoll',
				eyebrows: 'raisedExcited'
			},
			gauge: {
				fill: '#6b0e0e',
				track: '#f2e3e3'
			}
		}
	}

type AestheticType = {
	base: string[],
	avatar: {
		mouth: string,
		eyes: string,
		eyebrows: string
	},
	gauge: {
		fill: string,
		track: string
	}
}



const GAUGE_START = ((-90 - 113.5) * Math.PI) / 180;
const GAUGE_SWEEP = (227 * Math.PI) / 180;

const LAYOUT = {
	avatar: { x: 207, y: 285, size: 666 },
	// avatar: { x: 180, y: 285, size: 720 },
	card: { x: 195, y: 875, w: 690, h: 485, r: 44 },
	gauge: { cx: 540, cy: 1125, r: 200, width: 34 },
	grade: { size: 190, baseline: 1200 },
	title: { size: 36, baseline: 1305, maxWidth: 590 },
	logo: { right: 1010, bottom: 1780, height: 84 },
	shadow: { dx: 3, dy: 3, doublings: 9 },
	// Digits
	pattern: { size: 320, stepX: 300, stepY: 330, stagger: 150 },
};

const MAX_GRADE = 10;

// Shading the base color, variomoun na vrw sindiasmous
function shade(hex: string, amount: number): string {
	const n = parseInt(hex.slice(1), 16);
	const target = amount < 0 ? 0 : 255;
	const t = Math.abs(amount);
	const mix = (channel: number) => Math.round(channel + (target - channel) * t);

	const r = mix((n >> 16) & 0xff);
	const g = mix((n >> 8) & 0xff);
	const b = mix(n & 0xff);
	return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// CANVAS
function roundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number
) {
	r = Math.min(r, w / 2, h / 2);
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => reject(new Error(`Could not load image: ${src.slice(0, 64)}`));
		image.src = src;
	});
}

function createCanvas(): HTMLCanvasElement {
	const canvas = document.createElement('canvas');
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	return canvas;
}

/**
 * Roboto arrives from the Google Fonts CDN, so the very first share can race the
 * stylesheet and render in a fallback face. Ask for the exact faces we draw with
 * and wait for them.
 */
async function ensureFonts() {
	if (!document.fonts) return;
	try {
		await Promise.all([
			document.fonts.load(`bold ${LAYOUT.grade.size}px Roboto`),
			document.fonts.load(`bold ${LAYOUT.pattern.size}px Roboto`),
			document.fonts.load(`500 ${LAYOUT.title.size}px Roboto`)
		]);
		await document.fonts.ready;
	} catch {
		// A missing webfont costs us the typeface, not the image.
	}
}


// Producing an svg from the avatar
function avatarImage(aesthetic: AestheticType): Promise<HTMLImageElement> {
	const config: AvatarConfig = {
		...get(avatarStore),
		...(aesthetic.avatar),
		style: 'default',
	};

	// composeAvatar emits a viewBox but no width/height, and WebKit refuses to
	// size such an SVG when it is loaded through an <img>.
	const svg = composeAvatar(config).replace(
		'<svg ',
		`<svg width="${LAYOUT.avatar.size}" height="${LAYOUT.avatar.size}" `
	);

	return loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
}


// Grade tile
function drawPattern(ctx: CanvasRenderingContext2D, digit: string, color: string) {
	const { size, stepX, stepY, stagger } = LAYOUT.pattern;

	ctx.save();
	ctx.fillStyle = color;
	ctx.font = `bold ${size}px Roboto, sans-serif`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	const gradeRow = Array(20).fill(digit).join(' ');

	let row = 0;
	for (let y = -stepY / 2; y < HEIGHT + stepY; y += stepY) {
		const offset = (row % 2) * stagger;
		// for (let x = -stepX; x < WIDTH + stepX; x += stepX) {
		// 	ctx.fillText(digit, x + offset, y);
		// }
		ctx.fillText(gradeRow, offset, y)
		row++;
	}
	ctx.restore();
}


// Shadow, (just repeatedly drawing the silouette - adobe illustrator style lol)
function longShadow(silhouette: HTMLCanvasElement, color: string): HTMLCanvasElement {
	const { dx, dy, doublings } = LAYOUT.shadow;

	const shadow = createCanvas();
	const ctx = shadow.getContext('2d')!;

	// Flatten the silhouette's alpha to a single flat colour.
	ctx.drawImage(silhouette, 0, 0);
	ctx.globalCompositeOperation = 'source-in';
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	ctx.globalCompositeOperation = 'source-over';

	for (let step = 1; step < 1 << doublings; step *= 2) {
		ctx.drawImage(shadow, step * dx, step * dy);
	}
	return shadow;
}

function drawGauge(ctx: CanvasRenderingContext2D, ratio: number, aesthetic: AestheticType) {
	const { cx, cy, r, width } = LAYOUT.gauge;
	const colors = aesthetic.gauge

	ctx.save();
	ctx.lineWidth = width;
	ctx.lineCap = 'round';

	ctx.strokeStyle = colors.track;
	ctx.beginPath();
	ctx.arc(cx, cy, r, GAUGE_START, GAUGE_START + GAUGE_SWEEP);
	ctx.stroke();

	if (ratio > 0) {
		ctx.strokeStyle = colors.fill;
		ctx.beginPath();
		ctx.arc(cx, cy, r, GAUGE_START, GAUGE_START + GAUGE_SWEEP * ratio);
		ctx.stroke();
	}
	ctx.restore();
}

// Dynamically sized course title
function drawTitle(ctx: CanvasRenderingContext2D, title: string) {
	const { size, baseline, maxWidth } = LAYOUT.title;

	let fontSize = size;
	const text = title.toUpperCase();
	do {
		ctx.font = `500 ${fontSize}px Roboto, sans-serif`;
		fontSize -= 1;
	} while (ctx.measureText(text).width > maxWidth && fontSize > 16);

	ctx.textAlign = 'center';
	ctx.textBaseline = 'alphabetic';
	ctx.fillStyle = '#3a3a3a';
	ctx.fillText(text, LAYOUT.gauge.cx, baseline);
}

export interface GradeStoryOptions {
	courseTitle: string;
	formattedGrade: string;
	grade: number;
	isPassed: boolean;
}

// Render 1080x1920 png
export async function renderGradeStory({
	courseTitle,
	formattedGrade,
	grade,
	isPassed
}: GradeStoryOptions): Promise<HTMLCanvasElement> {
	await ensureFonts();

	const aesthetic: AestheticType = isPassed ? grade < 0.95 ? AESTHETICS.passed : AESTHETICS.perfect : AESTHETICS.failed

	const [avatar, logo] = await Promise.all([avatarImage(aesthetic), loadImage(logoWhite)]);

	const base = aesthetic.base[0] //TODO: Make base selectable
	const canvas = createCanvas();
	const ctx = canvas.getContext('2d')!;

	ctx.fillStyle = base;
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	drawPattern(ctx, formattedGrade, shade(base, -0.18));

	// The shadow is cast by the avatar and the card together, so build their
	// combined silhouette before either is drawn for real.
	const silhouette = createCanvas();
	const silhouetteCtx = silhouette.getContext('2d')!;
	silhouetteCtx.drawImage(avatar, LAYOUT.avatar.x, LAYOUT.avatar.y);
	roundedRect(silhouetteCtx, LAYOUT.card.x, LAYOUT.card.y, LAYOUT.card.w, LAYOUT.card.h, LAYOUT.card.r);
	silhouetteCtx.fill();
	ctx.drawImage(longShadow(silhouette, shade(base, -0.28)), 0, 0);

	ctx.drawImage(avatar, LAYOUT.avatar.x, LAYOUT.avatar.y);

	ctx.fillStyle = '#f5f5f5';
	roundedRect(ctx, LAYOUT.card.x, LAYOUT.card.y, LAYOUT.card.w, LAYOUT.card.h, LAYOUT.card.r);
	ctx.fill();

	drawGauge(ctx, Math.min(Math.max(grade * MAX_GRADE, 0), MAX_GRADE) / MAX_GRADE, aesthetic);

	ctx.fillStyle = aesthetic.gauge.fill;
	ctx.font = `bold ${LAYOUT.grade.size}px Roboto, sans-serif`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText(formattedGrade, LAYOUT.gauge.cx, LAYOUT.grade.baseline);

	drawTitle(ctx, courseTitle);

	const logoWidth = (logo.width / logo.height) * LAYOUT.logo.height;
	ctx.drawImage(
		logo,
		LAYOUT.logo.right - logoWidth,
		LAYOUT.logo.bottom - LAYOUT.logo.height,
		logoWidth,
		LAYOUT.logo.height
	);

	return canvas;
}


// DEBUG, alla isws na to valoume, preview
function showDebugPreview(dataUrl: string) {
	const overlay = document.createElement('div');
	overlay.setAttribute(
		'style',
		'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;' +
			'justify-content:center;background:rgba(0,0,0,.8);cursor:zoom-out;padding:2vh'
	);

	const image = new Image();
	image.src = dataUrl;
	image.setAttribute('style', 'max-width:100%;max-height:100%;box-shadow:0 0 40px rgba(0,0,0,.5)');
	overlay.appendChild(image);

	const close = () => overlay.remove();
	overlay.addEventListener('click', close);
	document.addEventListener('keydown', function onKey(event) {
		if (event.key !== 'Escape') return;
		document.removeEventListener('keydown', onKey);
		close();
	});

	document.body.appendChild(overlay);
}

/** Render the poster, write it to the app cache and open the native share sheet. */
export async function shareGradeStory(options: GradeStoryOptions): Promise<void> {
	const canvas = await renderGradeStory(options);
	const dataUrl = canvas.toDataURL('image/png');

	// TEMP (debug): web preview instead of the share sheet.
	if (!Capacitor.isNativePlatform()) {
		return;
		showDebugPreview(dataUrl);
	}

	const base64 = dataUrl.split(',')[1];

	// Share.share() only accepts file:// URIs, so the PNG has to hit disk first.
	// Directory.Cache is already covered by the app's FileProvider paths.
	const { uri } = await Filesystem.writeFile({
		path: `aristomate-grade-${Date.now()}.png`,
		data: base64,
		directory: Directory.Cache
	});

	await Share.share({ files: [uri] });
}
