import axios from 'axios';
import cheerio, { html } from 'cheerio';

export async function getReservForm() {
    let scrapedHTML: Array<string> = []; // Initialize the array
    try {
        // data = ... 
        // getting the data from the cafeteria website
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
        return scrapedHTML;

    } catch (error) {
        console.error('Error while scraping data:', error);
        return "Error while scraping data";
    }
}