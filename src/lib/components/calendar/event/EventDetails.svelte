<script lang="ts">
    import { EventStore } from '$components/calendar/event/EventStore';
	import type {Event} from '$components/calendar/event/Event';
    import {EventType, EventRepeatType , getEventTypeValue, getEventRepeatTypeValue} from '$components/calendar/event/Event';
	import { onMount } from 'svelte';

    export let selectedEvent: Event | null; 
    export let copyEvent: Event | null;
    let willRepeatType: string | null = null;

    $:{
        if(selectedEvent == null) {
            copyEvent = {
                id: new Date().getTime(),
                title: "",
                slot: {
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000)
                },
                type: EventType.TASK,
                location: "",
                description: "",
                professor: "",
                repeatInterval: 1,
                repeatUntil: null,
                notifyTime: 30,
                repeat: EventRepeatType.NEVER,
                notify: false
            }
        } else {
            copyEvent = JSON.parse(JSON.stringify(selectedEvent));
            willRepeatType = copyEvent.repeat == EventRepeatType.NEVER ? null : copyEvent?.repeatInterval ? "REPEAT" : "UNTIL";
        }
    };

</script>


<ion-content force-overscroll>
    <ion-list>
        
        <ion-item>
            <ion-input
            label="Τίτλος"
            label-placement="floating"
            id="title"
            type="text"
            value={copyEvent?.title || null}
            contenteditable="true"
            spellcheck={true}
            on:ionChange={(event)=>copyEvent.title=event.detail.value}
        />
        </ion-item>

        <ion-item lines="none">
            <ion-label>Έναρξη</ion-label>
            <ion-datetime-button datetime="start"></ion-datetime-button>
            <ion-modal keep-contents-mounted={true}>
                <ion-datetime id="start" presentation="date-time" minute-values="0,15,30,45" hour-cycle="h23" on:ionChange={(event)=>copyEvent.slot.start=event.detail.value}></ion-datetime>
            </ion-modal>
        </ion-item>
            
        <ion-item lines="none">
            <ion-label>Λήξη</ion-label>    
            <ion-datetime-button datetime="end"></ion-datetime-button>
            <ion-modal keep-contents-mounted={true}>
                <ion-datetime id="end" presentation="date-time" minute-values="0,15,30,45" hour-cycle="h23" on:ionChange={(event)=>copyEvent.slot.end=event.detail.value}></ion-datetime>
            </ion-modal>
        </ion-item>
        
        <div style="padding:10px;"/>

        <ion-item>
            <ion-select label="Τύπος συμβάντος" interface="popover" value={copyEvent.type} on:ionChange={(event)=>copyEvent.type=event.detail.value} label-placement="floating">
                {#each Object.values(EventType) as type}
                    <ion-select-option value={type}>{getEventTypeValue(type,'el')}</ion-select-option>
                {/each}
            </ion-select>
        </ion-item>

        {#if copyEvent.type == EventType.CLASS}
            <ion-item>
                <ion-input
                    label="Αίθουσα"
                    label-placement="floating"
                    id="location"
                    type="text"
                    value={copyEvent?.location || null}
                    contenteditable="true"
                    spellcheck={true}
                    on:ionChange={(event)=>copyEvent.location=event.detail.value}
                />
            </ion-item>
            <ion-item>
                <ion-input
                    label="Διδάσκων"
                    label-placement="floating"
                    id="professor"
                    type="text"
                    value={copyEvent?.professor || null}
                    contenteditable="true"
                    spellcheck={false}
                    on:ionChange={(event)=>copyEvent.professor=event.detail.value}
                />
            </ion-item>
        {/if}

        <ion-item>
            <ion-textarea
                label="Περιγραφή"
                label-placement="floating"
                id="description"
                value={copyEvent?.description || null}
                contenteditable="true"
                spellcheck={true}
                on:ionChange={(event)=>copyEvent.description=event.detail.value}
            />
        </ion-item>

        <ion-item>
            <ion-select style="width:50%;" label="Να επαναλαμβάνεται" interface="popover" value={copyEvent.repeat} on:ionChange={(event)=>{copyEvent.repeat=event.detail.value;}} label-placement="floating">
                {#each Object.values(EventRepeatType) as type}
                    <ion-select-option value={type}>{getEventRepeatTypeValue(type,'el')}</ion-select-option>
                {/each}
            </ion-select>
        </ion-item>

        {#if copyEvent.repeat != EventRepeatType.NEVER}
            <ion-item>
                <ion-select style="width:80%;" label="Λήξη" interface="popover" value={"REPEAT"} on:ionChange={(event)=>{willRepeatType=event.detail.value;}} label-placement="floating">
                    <ion-select-option value="REPEAT">Επαναλήψεις</ion-select-option>
                    <ion-select-option value="UNTIL">Ημερομηνία</ion-select-option>
                </ion-select>

                <div style="padding-inline:10px;"/>

                {#if willRepeatType == "UNTIL"}
                    <ion-datetime-button style="width: fit-content;" datetime="until"></ion-datetime-button>
                    <ion-modal keep-contents-mounted={true}>
                        <ion-datetime id="until" presentation="date-time" minute-values="0,15,30,45" hour-cycle="h23" on:ionChange={(event) => copyEvent.repeatUntil = event.detail.value}></ion-datetime>
                    </ion-modal>
                {:else}
                    <ion-input
                        label="Φορές"
                        label-placement="floating"
                        id="repeatInterval"
                        type="number"
                        value={copyEvent?.repeatInterval || null}
                        contenteditable="true"
                        spellcheck={false}
                        style="width: 30%;"
                        on:ionChange={(event)=>copyEvent.repeatInterval=event.detail.value}    
                    />
                {/if}
            </ion-item>
        {/if}

        <ion-item>
            <ion-select style="width:50%;" label="Ειδοποίηση" interface="popover" value={copyEvent.notify} on:ionChange={(event)=>{copyEvent.notify=event.detail.value;}} label-placement="floating">
                <ion-select-option value={true}>Ναι</ion-select-option>
                <ion-select-option value={false}>Όχι</ion-select-option>
            </ion-select>
            {#if copyEvent.notify}
                <div style="padding-inline:10px;"/>
                <ion-input
                    label="Πριν από (λεπτά)"
                    label-placement="floating"
                    id="notifyTime"
                    type="number"
                    value={copyEvent?.notifyTime || null}
                    contenteditable="true"
                    spellcheck={false}   
                    style="width: 50%;"
                    on:ionChange={(event)=>copyEvent.notifyTime=event.detail.value}
                />
            {/if}    
        </ion-item>

    </ion-list>
</ion-content>


<style>
    ion-item {
        margin-block: 1px;
    }
</style>