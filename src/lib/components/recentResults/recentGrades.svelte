<script>
	import { navController } from "$components/shared/StackedNav";
  import Course from "$components/courses/coursePage.svelte";

  /**
   * @type any
   */
  export let subject;

  /**
	 * @param {{ childCourses: string | any[]; course: any; }} course
	 */
   export function navigateToCourse(course) {
	    if (!(course.childCourses && course.childCourses.length > 0)) 
		  navController.push(Course, {id: course.id});
  }


</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->
<a on:click={() => navigateToCourse(subject.course)} class="card-link">
  <ion-item lines="none" class="ion-no-padding">
    <div class="containerFlex">
      <div class="titlesFlex">
        <ion-label class="ion-text-wrap courseTitle">{subject.course.name}</ion-label>
        <ion-label class="subjectID">{subject.course.id}</ion-label>
      </div>
      {#if subject.examGrade * 10 >= 5}
        <ion-text class="success gradeNumber">
          <h2>{subject.formattedGrade}</h2>
        </ion-text>
      {:else}
        <ion-text class="danger gradeNumber">
          <h2>{subject.formattedGrade}</h2>
        </ion-text>
      {/if}
    </div>
  </ion-item>
</a>


<style>
  .gradeNumber h2 {
    margin: 0 !important;
  }

  .containerFlex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 100%;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .courseTitle {
    font-size: 1rem;
  }

  .success {
    color: var(--app-color-green-dark);
  }

  .danger {
    color: var(--app-color-orange-dark);
  }

  .subjectID {
    font-size: 0.8rem;
    color: grey;
  }

  .card-link {
    text-decoration: none;
  }

</style>
