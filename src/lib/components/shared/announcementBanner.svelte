<script>
    export let colour = "";
</script>

<div class="systemNotification">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="betaBanner">
        <slot/>
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
