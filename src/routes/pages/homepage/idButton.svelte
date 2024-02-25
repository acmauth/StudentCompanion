<script>
    import AppCard from "$components/shared/AppCard.svelte";
	import { wallet } from 'ionicons/icons';
</script>

<div class="student-id">
    <AppCard margin={false} shadow={true} href="/id">
        <div style="background-color: #f3faff">
            <ion-icon class="id-icon" icon={wallet} />
        </div>
    </AppCard>
</div>

<style>
.student-id {
    /* margin: 1.5rem; */
    width: fit-content;
    border-style: solid;
    border-radius: 1rem;
    border-width: 1px;
    border-color: var(--app-color-primary-light);
}

.id-icon {
    margin: 0.7rem;
    font-size: 2.0rem;
    color: var(--app-color-primary-dark);
}
</style>