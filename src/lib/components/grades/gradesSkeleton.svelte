

<ion-card class="ion-padding-vertical">

  <ion-card-header>
    <ion-card-title>
      <h2>
        <ion-skeleton-text animated style="width: 100%" />
      </h2>
    </ion-card-title>

  </ion-card-header>
  

  <ion-card-content>
    <ion-list>
      <div class="courseDetails">
        <ion-label class="ion-padding-start">
          <ion-skeleton-text animated style="width: 100%" />
        </ion-label>
		

        <ion-item lines="none">
          <ion-label class="ion-text-wrap">
            <ion-skeleton-text animated style="width: 100%" />
          </ion-label>

          <ion-text class="ion-padding-left ion-padding-start">
          </ion-text>
        </ion-item>

        <ion-label class="ion-padding-bottom ion-padding-start">
          <ion-skeleton-text animated style="width: 100%" />
        </ion-label>

		<ion-label class="ion-padding-bottom ion-padding-start">
			<ion-skeleton-text animated style="width: 100%" />
		  </ion-label>

		  <ion-label class="ion-padding-bottom ion-padding-start">
			<ion-skeleton-text animated style="width: 100%" />
		  </ion-label>

		  <ion-label class="ion-padding-bottom ion-padding-start">
			<ion-skeleton-text animated style="width: 100%" />
		  </ion-label>

		  <ion-label class="ion-padding-bottom ion-padding-start">
			<ion-skeleton-text animated style="width: 100%" />
		  </ion-label>

		  <ion-label class="ion-padding-bottom ion-padding-start">
			<ion-skeleton-text animated style="width: 100%" />
		  </ion-label>
		
      </div>

      <!-- Repeat the skeleton structure for each courseDetails block -->
    </ion-list>
  </ion-card-content>
</ion-card>


{#each [1,2,3] as item}
<ion-card>

  <ion-item>
    <ion-thumbnail slot="end">
      <ion-skeleton-text />
   </ion-thumbnail>

  <ion-label>
      <p>
          <ion-skeleton-text animated style="width: 80%" />
      </p>
      <p>
          <ion-skeleton-text animated style="width: 80%" />
     </p>

  </ion-label>
</ion-item>
</ion-card>
{/each}

<style>

  .courseDetails {
	height: 35vh;
    display: flex;
    flex-direction: column;
  }
</style>
