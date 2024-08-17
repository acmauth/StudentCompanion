/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RequestHandler } from '@sveltejs/kit';
import axios from 'axios';
import cheerio from 'cheerio';

let scrapedHTML: Array<string> = [];
export const GET: RequestHandler = async ({ url }) => {
    try {
        // getting the data from the gym website
        const response = await axios.get('https://gym.auth.gr/reservations/');
        const htmlContent = response.data;
        const $ = cheerio.load(htmlContent);

        const $fieldsRules = $('p:contains("Σας ενημερώνουμε")');
        const $fieldsRulesUL = $fieldsRules.next('ul');
        const $fitRoomsRules = $('p:contains("Ο κάθε ασκούμενος")');
        const $fitRoomsRulesUL = $fitRoomsRules.next('ul');
        scrapedHTML[0] = $fieldsRules.html() as string;
        scrapedHTML[1] = $fieldsRulesUL.html() as string;
        scrapedHTML[2] = $fitRoomsRules.html() as string;
        scrapedHTML[3] = $fitRoomsRulesUL.html() as string;
    } catch (error) {
        console.error('Error while scraping data:', error);
    }

    return new Response(JSON.stringify(scrapedHTML));

};