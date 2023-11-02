/* eslint-disable @typescript-eslint/no-unused-vars */
import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import axios from 'axios';
import cheerio from 'cheerio';
let scrapedHTML = '';

export const GET: RequestHandler = async ({ url }) => {
    try {
        // data = ... 
        // getting the data from the cafeteria website
        const response = await axios.get('https://www.auth.gr/weekly-menu/');
        const htmlContent = response.data;
        const $ = cheerio.load(htmlContent);

        const days = $('.kt-blocks-accordion-title');
        const dailyMenus = $('.kt-accordion-panel-inner');
        dailyMenus.each(function (idx, el) {
            scrapedHTML += $(days[idx]).html();
            scrapedHTML += $(el).html();
        });
    } catch (error) {
        console.error('Error while scraping data:', error);
    }
    return new Response(JSON.stringify(scrapedHTML));
};