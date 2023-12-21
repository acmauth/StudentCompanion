<script>
    import { close } from 'ionicons/icons';
    import { createEventDispatcher } from 'svelte';
    // import { IonIcon } from '@ionic/react';
    export let subject;

    let dispatch = createEventDispatcher();
    const handleDelete = (id) => {
        dispatch('delete-card', id);
    }
</script>

<ion-card class="grade-card">
  <ion-card-content>
        
    <ion-chip class="ion-padding-start" on:click={() => handleDelete(subject.courseExam.id)}>
      <ion-label>Κλείσιμο</ion-label>
      <ion-icon name="close-circle-outline"></ion-icon>
    </ion-chip>
    <ion-item href="/" lines="none">
        <ion-label class="ion-text-wrap">{subject.course.name}</ion-label>
        
          {#if subject.examGrade * 10 >= 5}
            <ion-text class="ion-padding-left ion-padding-start" color="success">
              <h2>{subject.formattedGrade}</h2>
            </ion-text>
          {:else}
            <ion-text class="ion-padding-left ion-padding-start" color="danger">
              <h2>{subject.formattedGrade}</h2>
            </ion-text>
          {/if}
        
    </ion-item>
  
</ion-card-content>
</ion-card>

<style>
    .card-header {
      display: flex;
      justify-content: space-between;
    }

    .grade-card {
        border-radius: 22px;
    }
</style>