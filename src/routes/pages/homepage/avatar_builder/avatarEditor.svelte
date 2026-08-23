<script lang="ts">
	import AvatarPreview from '$lib/avatar/AvatarPreview.svelte';
	import {categories, defaultConfig, optionsFor, randomConfig} from '$lib/avatar/registry';
	import { palettes } from '$lib/avatar/colors';
	import type { ColorKey, OptionCategoryKey } from '$lib/avatar/types';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import SubPageHeader from '$components/shared/subPageHeader.svelte';
    import {accessories, beard, eyes, hair, mouth} from './categoryIcons'
    import { shirt, colorPalette } from 'ionicons/icons'
	import { avatarStore } from '$stores/avatar.store';
	import { t } from '$lib/i18n';

	const catIconMap: Partial<Record<OptionCategoryKey, string>> = {
		top: hair,
		accessories,
		facialHair: beard,
		eyes,
		mouth
	};

	const DISABLED = new Set(['style', 'clothingGraphic', 'nose'])
	const selectableCategories = categories.filter(category => !DISABLED.has(category.key))
	// Eyebrows are shown inside the eyes tab (with a divider), not as their own tab.
	const tabCategories = selectableCategories.filter(category => category.key !== 'eyebrows')

	// The avatar saved before editing began; used as the baseline for the save button.
	const savedBaseline = get(avatarStore);
	let config = structuredClone(savedBaseline);
	let showJson = false;
	let selectedCategory: string = selectableCategories[0].key;

	$: json = JSON.stringify(config, null, 2);

	// Show the save button only once the working config deviates from the saved baseline.
	$: changed = JSON.stringify(config) !== JSON.stringify(savedBaseline);

	function save() {
		avatarStore.set(config);
	}


	function randomize() {
		config = randomConfig();
	}

	function reset() {
		config = defaultConfig();
	}

	function setOption(key: OptionCategoryKey, value: string) {
		// Empty string means "omit" for optional categories.
		(config[key] as string | null) = value === '' ? null : value;
	}

	function setColor(key: ColorKey, value: string) {
		config.colors[key] = value;
	}

	function selectCategory(e: CustomEvent) {
		selectedCategory = e.detail.value as string;
	}

    function previewConfig(key: OptionCategoryKey, value: string) {
		return { ...config, [key]: value === '' ? null : value, "style":"default" };
	}

	// clothingGraphic only affects the avatar when the graphic shirt is worn.
	$: graphicActive = config.clothing === 'graphicShirt';

	$: colorLabels = {
		skin: $t('avatarBuilder.color.skin'),
		hair: $t('avatarBuilder.color.hair'),
		hat: $t('avatarBuilder.color.hat'),
		clothes: $t('avatarBuilder.color.clothes'),
		accessories: $t('avatarBuilder.color.accessories'),
		facialHair: $t('avatarBuilder.color.facialHair'),
		background: $t('avatarBuilder.color.background')
	} as Record<ColorKey, string>;

</script>


<!-- <ion-page> -->
<IonPage>
    <SubPageHeader title={$t('avatarBuilder.title')} stackedNav showSave={changed} saveLabel={$t('common.save')} on:save={save} />
    <ion-content fullscreen scroll-y={false}>
        <div class="editor">
            <div class="preview" style="background: {config.colors.background}">
                <!-- <AvatarPreview config={previewConfig('style', 'default')} /> -->
                 <div class="avatar_preview">
                    <AvatarPreview config={{...config, "style":"default"}} />
                </div>
                <div class="swatch_group">
                    <div class="swatches">
                        {#each palettes.background as color (color)}
                            <button
                                class="swatch"
                                class:selected={config.colors.background === color}
                                style:background={color}
                                title={color}
                                aria-label={`Background ${color}`}
                                on:click={() => setColor('background', color)}
                            />
                        {/each}
                    </div>
                </div>
            </div>
            <div class="settings">
                <ion-segment class="feature_select" scrollable value={selectedCategory} on:ionChange={selectCategory}>
                    {#each tabCategories as cat (cat.key)}
                        <ion-segment-button value={cat.key}>
                            {#if catIconMap[cat.key]}
                                <div class="cat-icon">{@html catIconMap[cat.key]}</div>
                            {:else if cat.key === 'clothing'}
                                <ion-icon icon={shirt} />
                            {:else}
                                <ion-label>{$t(cat.labelKey)}</ion-label>
                            {/if}
                        </ion-segment-button>
                    {/each}
                </ion-segment>

                {#each selectableCategories as cat (cat.key)}
                    {#if cat.key === selectedCategory}
                        <div class="category">
                            <!-- <p class="cat_name">{cat.key}</p> -->
                            {#each cat.colors ?? [] as colorKey (colorKey)}
                                <div class="swatch_group">
                                    <p>{$t('avatarBuilder.colourLabel', {color: colorLabels[colorKey]})}</p>
                                    <div class="swatches">
                                        {#each palettes[colorKey] as color (color)}
                                        <button
                                                    class="swatch"
                                                    class:selected={config.colors[colorKey] === color}
                                                    style:background={color}
                                                    title={`${colorLabels[colorKey]}: ${color}`}
                                                    aria-label={`${colorLabels[colorKey]} ${color}`}
                                                    on:click={() => setColor(colorKey, color)}>
                                        </button>
                                        {/each}
                                    </div>
                                </div>
                            {/each}
                            <div class="options">
                                {#if cat.optional}
                                    <div class="option ion-activatable" on:click={() => {setOption(cat.key, '')}} style="background: {config.colors.background}" aria-hidden={true}>
                                        <ion-ripple-effect/>
                                        <AvatarPreview config={previewConfig(cat.key, '')} size={86} />
                                    </div>
                                {/if}
                                {#each optionsFor(cat.key) as id (id)}
                                    <!-- {labelFor(id)} -->
                                    <div class="option ion-activatable" class:selected={config[cat.key] == id} on:click={() => {setOption(cat.key, id)}} style="background: {config.colors.background}" aria-hidden={true}>
                                        <ion-ripple-effect/>
                                        <AvatarPreview config={previewConfig(cat.key, id)} size={86} />
                                    </div>
                                {/each}
                            </div>
                            {#if cat.key === 'eyes'}
                                <hr class="divider" />
                                <p class="section_label">{$t('avatarBuilder.category.eyebrows')}</p>
                                <div class="options">
                                    {#each optionsFor('eyebrows') as id (id)}
                                        <div class="option ion-activatable" class:selected={config.eyebrows == id} on:click={() => {setOption('eyebrows', id)}} style="background: {config.colors.background}" aria-hidden={true}>
                                            <ion-ripple-effect/>
                                            <AvatarPreview config={previewConfig('eyebrows', id)} size={86} />
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </ion-content>
</IonPage>
<!-- </ion-page> -->
        
    
<style>


    .editor{
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .preview {
        padding-top: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        position: relative;
    }

    .avatar_preview {
        position: relative;
    }

    .preview .swatch_group {
        position: absolute;
        flex-direction: column;
        right: 0;
    }

    .preview .swatch_group .swatches {
        flex-direction: column;
    }

    .settings {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
        gap: 0rem;
    }

    .category {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-y: auto;
        scrollbar-width: none;
        padding: 1rem;
        gap: 1rem;
    }
    

    .category::-webkit-scrollbar {
        display: none;
    }
    
    /* .cat_name {
        text-transform: capitalize;
    } */

    .option{
        cursor: pointer;
        overflow: hidden;
        border-radius: 1rem;
        position: relative;
    }

    .option.selected {
        filter: drop-shadow(#3f3f3f 0 5px);
    }

    .swatch_group{
        display: flex;
        flex-direction: column;
        gap:2px;
        /* padding: 8px; */
    }

    .swatch_group p{
        margin: 0;
    }

    .swatches {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        overflow-x: scroll;
        overflow-y: visible;
        /* overflow: visible; */
        scrollbar-width: none;
        gap: 4px;
        margin-top: 6px;
        padding: 4px;
        /* padding: 8px; */
    }

    .swatches::-webkit-scrollbar {
        display: none;
    }

    .swatch {
        width: 32px;
        height: 32px;
        aspect-ratio: 1;
        flex-shrink: 0;
        padding: 0;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        cursor: pointer;
        overflow: visible;
    }

    .swatch.selected {
        outline: 2px solid #333;
        outline-offset: 1px;
    }

    /* :global(.feature_select) {
        --background: rgba(0, 0, 0, 0.06);
        height: fit-content;
        scrollbar-width: none;
        border-radius: 24px;
        padding: 3px;
    }

    :global(.feature_select)::-webkit-scrollbar {
        display: none;
    }

    :global(.feature_select ion-segment-button) {
        --background: transparent;
        --background-checked: var(--ion-color-primary, #3880ff);
        --color: var(--ion-color-dark, #333);
        --color-checked: #ffffff;
        --indicator-color: transparent;
        --indicator-height: 0px;
        --border-radius: 20px;
        min-height: 36px;
    } */

    .divider {
        border: none;
        border-top: 1px solid rgba(0, 0, 0, 0.12);
        margin: 1rem 0 0.5rem;
    }

    .section_label {
        margin: 0 0 0.5rem;
        opacity: 0.6;
        font-size: 0.85em;
    }

    .options {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        justify-content: center;
        align-items: center;
        gap:1rem;
        overflow: visible;
    }

    .options * {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .cat-icon {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
    }


    .cat-icon :global(svg) {
        width: 100%;
        height: 100%;
        overflow: visible;
    }
</style>