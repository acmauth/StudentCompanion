<script lang="ts">
	import AvatarPreview from '$lib/avatar/AvatarPreview.svelte';
	import {categories, defaultConfig, labelFor, optionsFor, randomConfig} from '$lib/avatar/registry';
	import { palettes } from '$lib/avatar/colors';
	import type { ColorKey, OptionCategoryKey } from '$lib/avatar/types';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import SubPageHeader from '$components/shared/subPageHeader.svelte';
    import {accessories, beard, eyebrows, eyes, hair, mouth} from './categoryIcons'
    import { shirt, colorPalette } from 'ionicons/icons'
	import { avatarStore } from './avatarStore';
	import { t } from '$lib/i18n';

	const catIconMap: Partial<Record<OptionCategoryKey, string>> = {
		top: hair,
		accessories,
		facialHair: beard,
		eyes,
		eyebrows,
		mouth
	};

	const DISABLED = new Set(['style', 'clothingGraphic', 'nose'])
	const selectableCategories = categories.filter(category => !DISABLED.has(category.key))

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
		return { ...config, [key]: value === '' ? null : value };
	}

	// clothingGraphic only affects the avatar when the graphic shirt is worn.
	$: graphicActive = config.clothing === 'graphicShirt';

	const colorLabels: Record<ColorKey, string> = {
		skin: 'Skin',
		hair: 'Hair',
		hat: 'Hat',
		clothes: 'Clothes',
		accessories: 'Accessories',
		facialHair: 'Facial hair',
		background: 'Background'
	};

</script>


<!-- <ion-page> -->
<IonPage>
    <SubPageHeader title={'Avatar Builder'} stackedNav showSave={changed} saveLabel={$t('common.save')} on:save={save} />
    <ion-content fullscreen scroll-y={false}>
        <div class="editor">
            <div class="preview" style="background: {config.colors.background}">
                <!-- <AvatarPreview config={previewConfig('style', 'default')} /> -->
                <AvatarPreview config={{...config, "style":"default"}} />
            </div>
            <div class="settings">
                <ion-segment class="feature_select" scrollable value={selectedCategory} on:ionChange={selectCategory}>
                    {#each selectableCategories as cat (cat.key)}
                        <ion-segment-button value={cat.key}>
                            {#if catIconMap[cat.key]}
                                <div class="cat-icon">{@html catIconMap[cat.key]}</div>
                            {:else if cat.key === 'clothing'}
                                <ion-icon icon={shirt} />
                            {:else}
                                <ion-label>{cat.label}</ion-label>
                            {/if}
                        </ion-segment-button>
                    {/each}
                    <ion-segment-button value="background">
                        <ion-icon icon={colorPalette} />
                    </ion-segment-button>
                </ion-segment>

                {#if selectedCategory === 'background'}
                    <div class="category">
                        <div class="swatch_group">
                            <p>Background Colour</p>
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
                {/if}

                {#each selectableCategories as cat (cat.key)}
                    {#if cat.key === selectedCategory}
                        <div class="category">
                            <!-- <p class="cat_name">{cat.key}</p> -->
                            {#each cat.colors ?? [] as colorKey (colorKey)}
                                <div class="swatch_group">
                                    <p>{labelFor(colorKey)} Colour</p>
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
                                    <div class="option" on:click={() => {setOption(cat.key, '')}} aria-hidden={true}>
                                        <AvatarPreview config={previewConfig(cat.key, '')} size={86} />
                                    </div>
                                {/if}
                                {#each optionsFor(cat.key) as id (id)}
                                    <!-- {labelFor(id)} -->
                                    <div class="option" class:selected={config[cat.key] == id} on:click={() => {setOption(cat.key, id)}} aria-hidden={true}>
                                        <AvatarPreview config={previewConfig(cat.key, id)} size={86} />
                                    </div>
                                {/each}
                            </div>
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
    }

    .settings {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
        gap: 0rem;
    }

    .category {
        flex: 1;
        overflow-y: auto;
        scrollbar-width: none;
    }
    

    .category::-webkit-scrollbar {
        display: none;
    }
    
    /* .cat_name {
        text-transform: capitalize;
    } */

    .option{
        cursor: pointer;
    }

    .option.selected {
        filter: drop-shadow(#3f3f3f 0 5px);
    }

    .swatch_group{
        display: flex;
        flex-direction: column;
        gap:2px;
        padding: 8px;
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

    .options {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        justify-content: center;
        align-items: center;
        gap:1rem
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