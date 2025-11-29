import axios from 'axios';
import cheerio from 'cheerio';
import { t } from "$lib/i18n";
import { get } from 'svelte/store';
export async function getMetroInfo() {
    try {

        // getting the data from the metro website
        let metroLink = get(t)("metro.link");

        const response = await axios.get(metroLink);

        const htmlContent = response.data;
        const $ = cheerio.load(htmlContent);

        const metroInfo = $('#collapseEventBody').contents().contents();

        let scrapedHTML = metroInfo.text().trim();
        console.log(scrapedHTML);
        return scrapedHTML;

    } catch (error) {
        console.error('Error while scraping data:', error);
        return get(t)("metro.error");
    }
}