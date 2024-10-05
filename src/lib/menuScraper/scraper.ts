import axios from 'axios';
import cheerio from 'cheerio';
import { t, getLocale } from "$lib/i18n";
import { get } from 'svelte/store';
import { menu } from 'ionicons/icons';
export async function getMenu() {
    let scrapedHTML: Array<string> = []; // Initialize the array
    try {
        // data = ... 
        // getting the data from the cafeteria website
        let menuLink = get(t)("menu.link");

        let response: any;
        if (getLocale() === "el") {
            // console.log(getLocale());
            // console.log(get(t)("menu.link"));


            response = await axios.get("https://www.auth.gr/en/weekly-menu/");
        } else {
            response = await axios.get("https://www.auth.gr/en/weekly-menu-en/");
        }
        console.log(response);
        const htmlContent = response.data;
        const $ = cheerio.load(htmlContent);

        const dailyMenus = $('.kt-accordion-panel-inner');
        dailyMenus.each(function (idx, el) {
            scrapedHTML[idx] = $(el).html() ?? '';
        });

        return scrapedHTML;

    } catch (error) {
        console.error('Error while scraping data:', error);
        return "Error while scraping data";
    }
}