<script lang="ts">
    import Flipper from "$components/shared/Flipper.svelte";
    import TestComponentA from "./testComponentA.svelte";
	import TestComponentB from "./testComponentB.svelte";
    import { flipped } from "./flipstore";

    function flip() {
        $flipped = !$flipped;
    }

</script>

<ion-content>
    <Flipper reactToHeight bind:flipped={$flipped}>
        <TestComponentA slot="front"/>
        <TestComponentB slot="back"/>
    </Flipper>
    <ion-chip on:click={flip} aria-hidden>This is some text</ion-chip>
</ion-content>
