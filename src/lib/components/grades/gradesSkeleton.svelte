<script lang="ts">
</script>

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
		

        <ion-item>
          <ion-label class="ion-text-wrap">
            <ion-skeleton-text animated style="width: 100%" />
          </ion-label>

          <ion-text class="ion-padding-left ion-padding-start">
            <h2>
              <ion-skeleton-text animated style="width: 50%" />
            </h2>
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

<ion-item>
		<ion-thumbnail slot="start">
	   <ion-skeleton-text />
	</ion-thumbnail>
	<ion-label>
		<h3 style="display: flex; flex-direction: row; gap:1rem;">
			<ion-skeleton-text animated style="width: 30%" /> <ion-skeleton-text animated style="width: 10%" />
		</h3>
		<p>
			<ion-skeleton-text animated style="width: 60%" />
		</p>
		<p>
			<ion-skeleton-text animated style="width: 80%" />
	   </p>
	   
	</ion-label>

</ion-item>

<style>

  .courseDetails {
	height: 50vh;
    display: flex;
    flex-direction: column;
  }
</style>
