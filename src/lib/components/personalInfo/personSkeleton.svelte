<sctipt lang="ts">

</sctipt>


<ion-card style="height: 20vh;">
    <ion-item lines="none">
        <ion-label>
            <h3 style="display: flex; flex-direction: row; gap:1rem;">
                <ion-skeleton-text animated style="width: 100%" /> 
            </h3>
            <p>
                <ion-skeleton-text animated style="width: 80%" />
            </p>
        </ion-label>
    </ion-item>
	<ion-item lines="none">
        <ion-label>
            <h3 style="display: flex; flex-direction: row; gap:1rem;">
                <ion-skeleton-text animated style="width: 100%" /> 
            </h3>

        </ion-label>
    </ion-item>
	
</ion-card>

{#each {length: 6} as i}
<ion-card>
    <ion-item lines="none">
        <ion-thumbnail slot="start">
            <ion-skeleton-text />
        </ion-thumbnail>
        <ion-label style="margin-top: 20px;">
            <h3 style="display: flex; flex-direction: row; gap:2rem;">
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
</ion-card>
{/each}
