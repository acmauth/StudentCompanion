<ion-card>
    <ion-card-header>
        <ion-card-title><ion-skeleton-text animated style="width: 80%"></ion-skeleton-text></ion-card-title>
        <ion-card-subtitle><ion-skeleton-text animated style="width: 60%"></ion-skeleton-text></ion-card-subtitle>
        <ion-card-subtitle><ion-skeleton-text animated style="width: 40%"></ion-skeleton-text></ion-card-subtitle>
    </ion-card-header>

    <ion-card-content class="ion-text-center">
        <ion-skeleton-text animated style="width: 50%; height: 24px;"></ion-skeleton-text>

        <ion-list>
            <ion-accordion-group expand="compact">
               
                    <ion-item slot="header" color="light">
                        <ion-skeleton-text />
                    </ion-item>
                    <h3 class="teachers" slot="content">
                        <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
                    </h3>
               
            </ion-accordion-group>

            <!-- Other skeleton items for course info -->
            <ion-item>
                <ion-skeleton-text />
                <ion-skeleton-text slot="end" animated style="width: 40%"></ion-skeleton-text>
            </ion-item>

            <ion-item>
                <ion-skeleton-text />
                <ion-skeleton-text slot="end" animated style="width: 40%"></ion-skeleton-text>
            </ion-item>

            <ion-item>
                <ion-skeleton-text />
                <ion-skeleton-text slot="end" animated style="width: 40%"></ion-skeleton-text>
            </ion-item>

            <ion-item>
                <ion-skeleton-text />
                <ion-skeleton-text slot="end" animated style="width: 40%"></ion-skeleton-text>
            </ion-item>
        </ion-list>
    </ion-card-content>
</ion-card>
