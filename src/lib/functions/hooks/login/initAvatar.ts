import { neoUniversisGet } from "$src/lib/dataService"
import { avatarStore } from "$stores/avatar.store";
import { first, defaultColors } from "$src/lib/avatar/registry";

export async function initAvatar(){
    let personalData = await neoUniversisGet(
			'Students/me'
		);
    
    const male = personalData.person.gender == 'Α';
    const female = personalData.person.gender == 'Γ';

    const defaultConfig = {
		style: 'circle',
		clothing: 'hoodie',
		clothingGraphic: first('clothingGraphic'),
		mouth: 'smile',
		nose: 'default',
		eyes: 'default',
		eyebrows: 'default',
		top: 'shaggyMullet',
		facialHair: null,
		accessories: null,
		colors: defaultColors()
	};

    const maleDefaultConfig = {
		style: 'circle',
		clothing: 'hoodie',
		clothingGraphic: first('clothingGraphic'),
		mouth: 'smile',
		nose: 'default',
		eyes: 'default',
		eyebrows: 'default',
		top: 'shortCurly',
		facialHair: null,
		accessories: null,
        colors: {...defaultColors(), background: "#5c66e6"}
	};

    const femaleDefault = {
		style: 'circle',
		clothing: 'hoodie',
		clothingGraphic: first('clothingGraphic'),
		mouth: 'smile',
		nose: 'default',
		eyes: 'default',
		eyebrows: 'default',
		top: 'straightAndStrand',
		facialHair: null,
		accessories: null,
        colors: {...defaultColors(), background: "#ff5c77"}
	};

    if (male) {
        avatarStore.set(maleDefaultConfig)
    } else if (female) {
        avatarStore.set(femaleDefault)
    } else {
        avatarStore.set(defaultConfig)
    }

}