<script lang="ts">
    import type {Event} from '$components/calendar/event/Event';
    import {EventType, EventRepeatType, getEventTypeValue, getEventRepeatTypeValue, getEventRepeatTypeCycleValue} from '$components/calendar/event/Event';
    import type { DatetimeChangeEventDetail } from '@ionic/core';
    import { t, getLocale } from "$lib/i18n";
    import { navigateCircle } from 'ionicons/icons';
    import { goto } from '$app/navigation';

    export let copyEvent: Event;

    function toLocalISOString(date: Date): string {
        const offset = -date.getTimezoneOffset();
        const sign = offset >= 0 ? '+' : '-';
        const absOffset = Math.abs(offset);
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
               `${pad(date.getHours())}:${pad(date.getMinutes())}` +
               `${sign}${pad(Math.floor(absOffset / 60))}:${pad(absOffset % 60)}`;
    }

    function safeDate(value: any, fallback?: Date): Date {
        const d = new Date(value);
        return isNaN(d.getTime()) ? (fallback ?? new Date()) : d;
    }

    // These are only used as initial values — ion-datetime reads them once on mount.
    // The {#key} in EventModal ensures this component is recreated when the event changes.
    const templateStartTime = toLocalISOString(safeDate(copyEvent.slot.start));
    const templateEndTime = toLocalISOString(safeDate(copyEvent.slot.end, new Date(Date.now() + 3600000)));
    const templateRepeatUntil = copyEvent.repeat !== EventRepeatType.NEVER && copyEvent.repeatUntil
        ? toLocalISOString(safeDate(copyEvent.repeatUntil))
        : templateEndTime;

    $: if (copyEvent.repeat !== EventRepeatType.NEVER) {
        copyEvent.repeatInterval = parseInt(String(copyEvent.repeatInterval ?? 1));
    }

    function updateStartTime(event: any) {
        copyEvent.slot.start = new Date(String(event.detail.value));
        if (new Date(copyEvent.slot.end).getTime() < copyEvent.slot.start.getTime()) {
            copyEvent.slot.end = new Date(copyEvent.slot.start.getTime() + 3600000);
        }
    }

    function updateEndTime(event: CustomEvent<DatetimeChangeEventDetail> & { target: HTMLIonDatetimeElement }) {
        const newEnd = new Date(String(event.detail.value));
        if (newEnd.getTime() < new Date(copyEvent.slot.start).getTime()) {
            copyEvent.slot.end = new Date(new Date(copyEvent.slot.start).getTime() + 3600000);
        } else {
            copyEvent.slot.end = newEnd;
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
                <ion-datetime id="start" locale={getLocale()} presentation="date-time" hour-cycle="h23" on:ionChange={updateStartTime} value={templateStartTime} max="2500-12-31T23:59"></ion-datetime>
            </ion-modal>
        </ion-item>
            
        <ion-item lines="none">
            <ion-label>{$t('event.end')}</ion-label>    
            <ion-datetime-button datetime="end"></ion-datetime-button>
            <ion-modal keep-contents-mounted={true}>
                    <ion-datetime id="end" locale={getLocale()} presentation="date-time" hour-cycle="h23" on:ionChange={updateEndTime} value={templateEndTime} max="2500-12-31T23:59"></ion-datetime>
            </ion-modal>
        </ion-item>
        
        <!-- <div style="padding:10px;"/> -->

        <ion-item>
            <ion-select label={$t('event.type')} interface="popover" value={copyEvent.type} on:ionChange={(event)=>copyEvent.type=event.detail.value} label-placement="floating">
                {#each Object.values(EventType) as type}
                    <ion-select-option value={type}>{getEventTypeValue(type, getLocale())}</ion-select-option>
                {/each}
            </ion-select>
        </ion-item>

        <ion-item>
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                {#if copyEvent.location && copyEvent.locationCode}
                    <ion-label>{$t('event.location')}</ion-label>
                    <ion-chip
                        outline
                        style="cursor: pointer; flex-shrink: 1; min-width: 0;"
                        on:click={() => { if (copyEvent.locationCode) goto("/pages/maps?roomid=" + copyEvent.locationCode);}}
                        aria-hidden
                    >
                        <ion-icon icon={navigateCircle}></ion-icon>
                        <ion-label style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 10rem; display: block;">{copyEvent.location}eeeeeeeeeeeeeeeeeee</ion-label>
                    </ion-chip>
                {:else}
                    <ion-input
                        label={$t('event.location')}
                        label-placement="floating"
                        id="location"
                        type="text"
                        value={copyEvent.location || null}
                        contenteditable="true"
                        spellcheck={true}
                        on:ionChange={(event)=>copyEvent.location=event.detail.value?? "" }
                    />
                {/if}
            </div>
        </ion-item>

        {#if copyEvent.type == EventType.CLASS}
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
                    <ion-label>{$t("event.notification.repeatPer")}</ion-label>
                    <ion-input
                        id="repeatInterval"
                        type="number"
                        placeholder="1"
                        min="1"
                        step="1"
                        max="10"
                        value={copyEvent.repeatInterval ?? 1}
                        contenteditable="true"
                        style="width:   20%;"
                        on:ionChange={(event)=>{
                            let inputValue = parseInt(event.detail.value);
                            if (inputValue < 1 || isNaN(inputValue)) {
                                inputValue = 1;
                            }
                            copyEvent.repeatInterval = inputValue;
                            event.target.value = inputValue;
                        }}
                    />
                                
                    <ion-label style="margin-inline:5px;">
                        {getEventRepeatTypeCycleValue(copyEvent.repeat, getLocale())}
                    </ion-label>
                </ion-item>
            </div>
                
            <ion-item>    
                <ion-label>{$t("event.notification.repeatUntil")}</ion-label>    
                
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
                    min="1"
                    step="1"
                    max="10"
                    value={copyEvent?.notifyTime || null}
                    contenteditable="true"
                    spellcheck={false}   
                    style="width: 50%;"
                    on:ionChange={(event)=>{
                        let inputValue = parseInt(event.detail.value);
                        if (inputValue < 1 || isNaN(inputValue)) {
                            inputValue = 1;
                        }
                        copyEvent.notifyTime = inputValue;
                        event.target.value = inputValue;
                    }}
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