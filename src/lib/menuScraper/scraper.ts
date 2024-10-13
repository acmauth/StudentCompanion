import axios from 'axios';
import cheerio from 'cheerio';
import { t } from "$lib/i18n";
import { get } from 'svelte/store';
export async function getMenu() {
    let scrapedHTML: Array<string> = []; // Initialize the array
    try {

        // getting the data from the cafeteria website
        let menuLink = get(t)("menu.link");

        const response = await axios.get(menuLink);

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