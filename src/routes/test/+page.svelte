<script lang="ts">

    let outlineValue = true;
    function toggleOutline() {
        outlineValue = !outlineValue;
    };
    
</script>

<ion-chip outline={outlineValue} on:click={toggleOutline} aria-hidden>Hello</ion-chip>
<p>{outlineValue}</p>