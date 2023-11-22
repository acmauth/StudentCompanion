<script>
    import { close } from 'ionicons/icons';
    import {dismissedGrades} from './dismissedGrades';
    import { createEventDispatcher } from 'svelte';
    export let subject;

    let dispatch = createEventDispatcher();
    const handleDelete = (id) => {
        dispatch('delete-card', id);
    }
</script>

<ion-card class="grade-card">
    <ion-card-header>
        <div class="card-header">
            { subject.course.name }
            <ion-button class="close" on:click={() => handleDelete(subject.courseExam.id)}>X</ion-button>
        </div>
    </ion-card-header>
    <ion-card-content>
      <ion-row class="ion-justify-content-start">
        <ion-col  class="grade-col">
          <div class="grade">
            { subject.formattedGrade }
          </div>
        </ion-col>

      </ion-row>
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