<script lang="ts">
	import type { AvatarConfig } from './types';
	import { composeAvatar } from './compose';

	interface Props {
		config: AvatarConfig;
		size?: number;
	}

	let { config, size = 280 }: Props = $props();

	let svg = $derived(composeAvatar(config));
</script>

<div
	class="avatar-preview inline-block overflow-hidden rounded-2xl"
	style="width: {size}px; height: {size}px;"
>
	<!-- composeAvatar produces trusted, app-generated SVG markup -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html svg}
</div>

<style>
	.avatar-preview :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
