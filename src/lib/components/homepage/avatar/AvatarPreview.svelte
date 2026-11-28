<script lang="ts">
	import type { AvatarConfig } from '$methods/avatar/types';
	import { composeAvatar } from '$methods/avatar/compose';

	export let config: AvatarConfig;
	export let size = 280;

	$:  svg = composeAvatar(config);
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
