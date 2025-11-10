import axios from 'axios';
import cheerio from 'cheerio';
import { t } from "$lib/i18n";
import { get } from 'svelte/store';
import Config from "$src/app.config";
export async function getMetroInfo() {
    // let scrapedHTML: Array<string> = []; // Initialize the array
    try {

        // getting the data from the metro website
        // let metroLink = get(t)("metro.link");

        // const response = await axios.get(metroLink);

        // const htmlContent = response.data;
        // const $ = cheerio.load(htmlContent);

        // const metroInfo = $('#collapseEventBody').contents().contents();

        // metroInfo.each(function (idx, el) {
        //     scrapedHTML[idx] = $(el).html() ?? '';
        // });
        // let scrapedHTML = metroInfo.text().trim();
        // console.log(scrapedHTML);

        const apiUrl = Config.menu.api;
        const response = await axios.get(apiUrl, { timeout: 5000 });
        return response.data;

    } catch (error) {
        console.error('Error while scraping data:', error);
        return "Error while scraping data";
    }
}