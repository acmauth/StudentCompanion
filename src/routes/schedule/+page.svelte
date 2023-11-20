<script lang="ts">
	import Days from '$lib/components/schedule/day/dayList.svelte';
    import * as allIonicIcons from 'ionicons/icons';

</script>


<ion-page class="card-container">
    <ion-grid>
        <ion-row>
    <Days />
</ion-row>
<ion-grid>
    <ion-card href="/" class="ion-padding">
        <ion-grid class="card">
            <ion-row>
                <!-- <ion-col>
                    <p>{subject.time.getHours()}</p>
                </ion-col>
                <ion-col>
                    <h2>{subject.title}</h2>
                    <p>{subject.classroom}</p>
                    <p>{subject.professor}</p> -->
                <!-- </ion-col> -->
            </ion-row>
        </ion-grid>
    </ion-card>
</ion-grid>
</ion-grid>
</ion-page>

<style>
    .card-container {
        display: flex;
        justify-content: center;
    }
    .card {
        display: flex;
        align-items: center;
        justify-content: start;
        padding: 0 1rem;
    }

    ion-card {
        transition: all ease-in-out 0.2s;
    }

    ion-card:active {
        transform: scale(0.95);
    }

    .icons {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
</style>