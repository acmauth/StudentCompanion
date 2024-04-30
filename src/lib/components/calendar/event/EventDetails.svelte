<script lang="ts">
	import type {Event} from '$components/calendar/event/Event';
    import {EventType, EventRepeatType , getEventTypeValue, getEventRepeatTypeValue} from '$components/calendar/event/Event';
	import { get } from 'imapflow/lib/imap-commands';
	import { copy } from 'ionicons/icons';
	import { onMount } from 'svelte';

    export let copyEvent: Event | null;
    let willRepeatType: string | null = null;
    let templateStartTime: string, templateEndTime: string;
    
    $: {
        if(!copyEvent) {
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
        }
        try{
            templateStartTime = copyEvent?.slot.start.getFullYear() + "-" +
                                (String(copyEvent?.slot.start.getMonth() + 1)).padStart(2, '0') + "-" +
                                String(copyEvent?.slot.start.getDate()).padStart(2, '0') + "T" +
                                String(copyEvent?.slot.start.getHours()).padStart(2, '0') + ":" +
                                String(copyEvent?.slot.start.getMinutes()).padStart(2, '0');

            templateEndTime = copyEvent?.slot.end.getFullYear() + "-" +
                                (String(copyEvent?.slot.end.getMonth() + 1)).padStart(2, '0') + "-" +
                                String(copyEvent?.slot.end.getDate()).padStart(2, '0') + "T" +
                                String(copyEvent?.slot.end.getHours()).padStart(2, '0') + ":" +
                                String(copyEvent?.slot.end.getMinutes()).padStart(2, '0');
        } catch { 
            templateStartTime = new Date().toISOString();
            templateEndTime = new Date(new Date().getTime() + 3600000).toISOString();
        }
        willRepeatType = copyEvent.repeat == EventRepeatType.NEVER ? null : copyEvent.repeatInterval ? "REPEAT" : "UNTIL";
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
                <ion-datetime id="start" presentation="date-time" minute-values="0,15,30,45" hour-cycle="h23" on:ionChange={(event)=>copyEvent.slot.start=new Date(event.detail.value)} value="{templateStartTime}"></ion-datetime>
            </ion-modal>
        </ion-item>
            
        <ion-item lines="none">
            <ion-label>Λήξη</ion-label>    
            <ion-datetime-button datetime="end"></ion-datetime-button>
            <ion-modal keep-contents-mounted={true}>
                <ion-datetime id="end" presentation="date-time" minute-values="0,15,30,45" hour-cycle="h23" on:ionChange={(event)=>copyEvent.slot.end=new Date(event.detail.value)} value="{templateEndTime}"></ion-datetime>
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
                    on:ionChange={(event)=>copyEvent.location=event.detail.value??""}
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
                    on:ionChange={(event)=>copyEvent.professor=event.detail.value??""}
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
                on:ionChange={(event)=>copyEvent.description=event.detail.value??""}
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
                        <ion-datetime id="until" presentation="date-time" minute-values="0,15,30,45" hour-cycle="h23" on:ionChange={(event) => {copyEvent.repeatUntil = new Date(event.detail.value);}}></ion-datetime>
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
                        on:ionChange={(event)=>{copyEvent.repeatInterval= new Number(event.detail.value)}}    
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
                    on:ionChange={(event)=>{copyEvent.notifyTime=new Number(event.detail.value)}}
                />
            {/if}    
        </ion-item>

    </ion-list>
</ion-content>


<style>
    ion-list {
        background-color: var(--ion-background-color) !important;
    }
    ion-item {
        margin-block: 1px;
    }
</style>