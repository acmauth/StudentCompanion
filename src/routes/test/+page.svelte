<script>
    import Flipper from "$components/shared/Flipper.svelte";
    import TestComponentA from "./testComponentA.svelte";
	import TestComponentB from "./testComponentB.svelte";

</script>

<ion-content>
    <Flipper reactToHeight>
        <TestComponentA slot="front"/>
        <TestComponentB slot="back"/>
    </Flipper>
</ion-content>

