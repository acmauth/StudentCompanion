import { error } from '@sveltejs/kit';
import axios from 'axios';
import cheerio from 'cheerio';

export async function getMenu(){
    let scrapedHTML: Array<string> = []; // Initialize the array
    try {
        // data = ... 
        // getting the data from the cafeteria website
        const response = await axios.get('https://www.auth.gr/weekly-menu/');
        const htmlContent = response.data;
        const $ = cheerio.load(htmlContent);

        const days = $('.kt-blocks-accordion-title');
        const dailyMenus = $('.kt-accordion-panel-inner');
        dailyMenus.each(function (idx, el) {
            scrapedHTML[idx] = $(el).html();
        });
        console.log(scrapedHTML);
        
        return scrapedHTML;

    } catch (error) {
        console.error('Error while scraping data:', error);
        return "Error while scraping data";
    }
}