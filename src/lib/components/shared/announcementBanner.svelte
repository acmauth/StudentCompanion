<script>
	/**
	 * @typedef {Object} Props
	 * @property {string} [colour]
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { colour = "", children } = $props();
</script>

<div class="systemNotification">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="betaBanner">
        {@render children?.()}
    </div>
    <!-- <div class="triangle"></div> -->
</div>

<style>
    .betaBanner {
		background-color: var(--app-color-primary-dark);
		padding: 0.5rem;
		text-align: center;
	}

	.triangle {
		content: '';
		margin-top: -1px;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-top: 10px solid #0057b8; /* Same color as the banner background */
	}

	.systemNotification {
		/* position: fixed; */
		width: 100%;
		z-index: 100;
	}
</style>
