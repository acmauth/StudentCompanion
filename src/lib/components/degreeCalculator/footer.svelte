<script lang="ts">
    import { Capacitor } from '@capacitor/core';

    export let degree_grade_string: any = "";
</script>



<ion-footer mode="ios" id="footer">
    <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
        <ion-title style="text-align: center;">Βαθμός πτυχίου = <span style="color: #0054e9;">{degree_grade_string}</span></ion-title>
    </ion-toolbar>
</ion-footer>
	


<style>
</style>