<script lang="ts">
	import { navController } from "$components/shared/StackedNav";
  import Course from "$components/courses/coursePage.svelte";
	import timeSinceDate from "$src/lib/globalFunctions/getTimeSinceDate";
	import { getLocale } from "$src/lib/i18n";
  import { school } from 'ionicons/icons';

  export let subject: any;

  export function navigateToCourse(course: any) {
	    if (!(course.childCourses && course.childCourses.length > 0))
		  navController.push(Course, {id: course.id});
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->
<a on:click={() => navigateToCourse(subject.course)} class="card-link">
  <div class="grade-card">
    <div class="row-header">
      <div class="left-col">
        <div class="icon-wrapper">
          <ion-icon icon={school}></ion-icon>
        </div>
        <div class="course-details">
          <span class="course-name">{subject.course.name}</span>
          <span class="time">{timeSinceDate(subject.gradeModified, getLocale())}</span>
        </div>
      </div>
      <div class="right-col">
        <span class="grade-pill {subject.examGrade * 10 >= 5 ? 'success' : 'danger'}">
          {subject.formattedGrade}
        </span>
      </div>
    </div>
  </div>
</a>

<style>
  .card-link {
    text-decoration: none;
    display: block;
    width: 100%;
    transition: opacity 0.15s ease;
  }

  .card-link:active {
    opacity: 0.7;
  }

  .grade-card {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .row-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .left-col {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    overflow: hidden;
  }

  .icon-wrapper {
    background: rgba(var(--ion-color-primary-rgb), 0.12);
    color: var(--ion-color-primary);
    border-radius: 10px;
    width: 36px;
    height: 36px;
    box-sizing: border-box;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .icon-wrapper ion-icon {
    display: block;
  }

  .course-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
  }

  .course-name {
    font-weight: 600;
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--ion-text-color);
  }

  .time {
    font-size: 0.75rem;
    color: var(--ion-color-medium);
  }

  .right-col {
    padding-left: 12px;
    display: flex;
    align-items: center;
  }

  .grade-pill {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1;
    padding: 0.3rem 0.65rem;
    border-radius: 0.7rem;
    background: rgba(128, 128, 128, 0.1);
  }

  .success {
    color: var(--app-color-green-dark);
  }

  .danger {
    color: var(--app-color-orange-dark);
  }
</style>
