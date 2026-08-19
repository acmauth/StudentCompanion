<script lang="ts">
    import { t } from "$src/lib/i18n";
</script>

<div class="stat_tiles">
    {#each { length: 3 } as _}
        <div class="stat_tile">
            <ion-skeleton-text animated style="width: 2.5rem; height: 1.4rem; margin: 0;"></ion-skeleton-text>
            <ion-skeleton-text animated style="width: 70%; height: 0.75rem; margin: 0;"></ion-skeleton-text>
        </div>
    {/each}
</div>

<span class="section_label">{$t('course.comparison')}</span>
<ion-card class="stats_card">
    <ion-skeleton-text animated style="width: 40%; height: 1rem; margin: 1rem auto 1.35rem;"></ion-skeleton-text>
    <ion-skeleton-text animated style="width: calc(100% - 2rem); height: 0.85rem; border-radius: 999px; margin: 0 1rem 1rem;"></ion-skeleton-text>
    <div class="legend">
        {#each { length: 3 } as _}
            <ion-skeleton-text animated style="width: 3rem; height: 1.5rem; margin: 0;"></ion-skeleton-text>
        {/each}
    </div>
</ion-card>

<span class="section_label">{$t('course.results')}</span>
<ion-card class="stats_card">
    <ion-list>
        <ion-item>
            <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
            <ion-skeleton-text slot="end" animated style="width: 20%"></ion-skeleton-text>
        </ion-item>
        <ion-item>
            <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
            <ion-skeleton-text slot="end" animated style="width: 20%"></ion-skeleton-text>
        </ion-item>
        <ion-item lines="none">
            <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
            <ion-skeleton-text slot="end" animated style="width: 20%"></ion-skeleton-text>
        </ion-item>
    </ion-list>
</ion-card>
