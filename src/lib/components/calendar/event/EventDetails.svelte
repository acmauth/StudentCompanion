<script lang="ts">
    import type {Event} from '$components/calendar/event/Event';
    import {EventType, EventRepeatType , getEventTypeValue, getEventRepeatTypeValue} from '$components/calendar/event/Event';
    import type { DatetimeChangeEventDetail } from '@ionic/core';
    import { onMount } from 'svelte';
    import { t, getLocale} from "$lib/i18n";

    export let copyEvent: Event;
    let templateStartTime: string, templateEndTime: string;
    let templateRepeatUntil: string;
    

    $: {
        let start: Date = new Date(copyEvent.slot.start);
        let end: Date = new Date(copyEvent.slot.end);
        let repeatUntil: Date = new Date(copyEvent.repeatUntil);
                
        try{
            templateStartTime = start.getFullYear() + "-" +
                                (String(start.getMonth() + 1)).padStart(2, '0') + "-" +
                                String(start.getDate()).padStart(2, '0') + "T" +
                                String(start.getHours()).padStart(2, '0') + ":" +
                                String(start.getMinutes()).padStart(2, '0');

            templateEndTime = end.getFullYear() + "-" +
                                (String(end.getMonth() + 1)).padStart(2, '0') + "-" +
                                String(end.getDate()).padStart(2, '0') + "T" +
                                String(end.getHours()).padStart(2, '0') + ":" +
                                String(end.getMinutes()).padStart(2, '0');
            if(copyEvent.repeat != "NEVER") {
                templateRepeatUntil = repeatUntil.getFullYear() + "-" +
                                    (String(repeatUntil.getMonth() + 1)).padStart(2, '0') + "-" +
                                    String(repeatUntil.getDate()).padStart(2, '0') + "T" +
                                    String(repeatUntil.getHours()).padStart(2, '0') + ":" +
                                    String(repeatUntil.getMinutes()).padStart(2, '0');
            } else {
                templateRepeatUntil = templateEndTime;
            }
        } catch(e) {
            console.log(e); 
            templateStartTime = new Date().toISOString();
            templateEndTime = new Date(new Date().getTime() + 3600000).toISOString();
            templateRepeatUntil = templateEndTime;
            copyEvent.repeatInterval = 1;
        }
        if (copyEvent.repeat != "NEVER") { 
            copyEvent.repeatInterval = parseInt(String(copyEvent.repeatInterval ?? 1));
            copyEvent.repeatUntil = new Date(String(templateRepeatUntil));
        }

    };

    function UpdateStartTime(event) {
        copyEvent.slot.start=new Date(String(event.detail.value))
        if (new Date(copyEvent.slot.end).getTime() < copyEvent.slot.start.getTime()) {
            copyEvent.slot.end = new Date(new Date(copyEvent.slot.start).getTime() + 3600000); 
            templateEndTime = copyEvent.slot.end.toISOString();
        }
    }

    function UpdateEndTime(event: CustomEvent<DatetimeChangeEventDetail> & { target: HTMLIonDatetimeElement; }) {
        let end = new Date(String(event.detail.value));
        if (end.getTime() < new Date(copyEvent.slot.start).getTime()) {
            copyEvent.slot.end = new Date(new Date(copyEvent.slot.start).getTime() + 3600000); 
            templateEndTime = copyEvent.slot.end.toISOString();
        } else {
            copyEvent.slot.end = end;
        }
    }

</script>


<ion-content force-overscroll>
    <ion-list>
        
        <ion-item>
            <ion-input
            label= {$t('event.name')}
            label-placement="floating"
            id="title"
            type="text"
            value={copyEvent.title || null}
            contenteditable="true"
            spellcheck={true}
            on:ionChange={(event)=>{copyEvent.title = event.detail.value || '';}}
        />
        </ion-item>

        <ion-item lines="none">
            <ion-label>{$t('event.start')}</ion-label>
            <ion-datetime-button datetime="start"></ion-datetime-button>
            <ion-modal keep-contents-mounted={true}>
                <ion-datetime id="start" presentation="date-time" minute-values="0,15,30,45" hour-cycle="h23" on:ionChange={(event)=>UpdateStartTime(event)} value="{templateStartTime}"></ion-datetime>
            </ion-modal>
        </ion-item>
            
        <ion-item lines="none">
            <ion-label>{$t('event.end')}</ion-label>    
            <ion-datetime-button datetime="end"></ion-datetime-button>
            <ion-modal keep-contents-mounted={true}>
                <ion-datetime id="end" presentation="date-time" minute-values="0,15,30,45" hour-cycle="h23" on:ionChange={(event)=>UpdateEndTime(event)} value="{templateEndTime}"></ion-datetime>
            </ion-modal>
        </ion-item>
        
        <div style="padding:10px;"/>

        <ion-item>
            <ion-select label={$t('event.type')} interface="popover" value={copyEvent.type} on:ionChange={(event)=>copyEvent.type=event.detail.value} label-placement="floating">
                {#each Object.values(EventType) as type}
                    <ion-select-option value={type}>{getEventTypeValue(type, getLocale())}</ion-select-option>
                {/each}
            </ion-select>
        </ion-item>

        {#if copyEvent.type == EventType.CLASS}
            <ion-item>
                <ion-input
                    label={$t('event.class')}
                    label-placement="floating"
                    id="location"
                    type="text"
                    value={copyEvent.location || null}
                    contenteditable="true"
                    spellcheck={true}
                    on:ionChange={(event)=>copyEvent.location=event.detail.value?? "" }
                />
            </ion-item>
            <ion-item>
                <ion-input
                    label={$t('event.professor')}
                    label-placement="floating"
                    id="professor"
                    type="text"
                    value={copyEvent.professor || null}
                    contenteditable="true"
                    spellcheck={false}
                    on:ionChange={(event)=>copyEvent.professor=event.detail.value ?? "" }
                />
            </ion-item>
        {/if}

        <ion-item>
            <ion-textarea
                label={$t('event.description')}
                label-placement="floating"
                id="description"
                value={copyEvent.description || null}
                contenteditable="true"
                spellcheck={true}
                on:ionChange={(event)=>copyEvent.description=event.detail.value ?? "" }
            />
        </ion-item>

        
        <ion-item>
            <ion-select id="repeatSelector" style="width:50%;" label={$t("event.isRepeated")} interface="popover" value={copyEvent.repeat} on:ionChange={(event)=>{copyEvent.repeat=event.detail.value;}} label-placement="floating">
                {#each Object.values(EventRepeatType) as type}
                    <ion-select-option value={type}>{getEventRepeatTypeValue(type, getLocale())}</ion-select-option>
                {/each}
            </ion-select>
        </ion-item>

        {#if copyEvent.repeat != EventRepeatType.NEVER}
            <div style="display:flex; justify-self:space-between;">
                <ion-item lines="none">
                    <ion-label>Ανά</ion-label>
                    <ion-input
                        id="repeatInterval"
                        type="number"
                        placeholder="1"
                        value={copyEvent.repeatInterval ?? 1}
                        contenteditable="true"
                        style="width:   20%;"
                        on:ionChange={(event)=>{copyEvent.repeatInterval = parseInt(String(event.detail.value));}}
                    />
                                
                    <ion-label style="margin-inline:5px;">
                        {getEventRepeatTypeCycleValue(copyEvent.repeat,'el')}
                    </ion-label>
                </ion-item>
            </div>
                
            <ion-item>    
                <ion-label>Μέχρι</ion-label>    
                
                <ion-datetime-button style="width: fit-content;" datetime="until"></ion-datetime-button>
                <ion-modal keep-contents-mounted={true}>
                    <ion-datetime id="until" presentation="date-time" minute-values="0,15,30,45" value={templateRepeatUntil} hour-cycle="h23" on:ionChange={(event) => {copyEvent.repeatUntil = new Date(String(event.detail.value));}}></ion-datetime>
                    </ion-modal>
                    
            </ion-item>
        {/if}

        <ion-item>
            <ion-select style="width:50%;" label={$t('event.notification')} interface="popover" value={copyEvent.notify} on:ionChange={(event)=>{copyEvent.notify=event.detail.value;}} label-placement="floating">
                <ion-select-option value={true}>{$t('option.yesL')}</ion-select-option>
                <ion-select-option value={false}>{$t('option.noL')}</ion-select-option>
            </ion-select>
            {#if copyEvent.notify}
                <div style="padding-inline:10px;"/>
                <ion-input
                    label={$t('event.notifyTime')}
                    label-placement="floating"
                    id="notifyTime"
                    type="number"
                    value={copyEvent?.notifyTime || null}
                    contenteditable="true"
                    spellcheck={false}   
                    style="width: 50%;"
                    on:ionChange={(event)=>{copyEvent.notifyTime = parseInt(String(event.detail.value));}}
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