/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RequestHandler } from '@sveltejs/kit';
import axios from 'axios';
import cheerio from 'cheerio';
import { t, getLocale } from "$lib/i18n";
import { get } from 'svelte/store';

let scrapedHTML: Array<string> = []; // Initialize the array
// const menulink = get(t)("menu.link");
export const GET: RequestHandler = async ({ url }) => {
    try {
        // console.log("menulink", menulink);
        const menuLink = get(t)("menu.link");
        console.log("here", getLocale());
        console.log(get(t)("menu.link"));

        // const response = await axios.get(menuLink);

        let response;
        if (getLocale() === "el") {
            console.log("made it here");
            response = await axios.get("https://www.auth.gr/weekly-menu/");
        } else {
            response = await axios.get("https://www.auth.gr/en/weekly-menu-en/");
        }
        const htmlContent = response.data;
        const $ = cheerio.load(htmlContent);

        const dailyMenus = $('.kt-accordion-panel-inner');
        dailyMenus.each(function (idx, el) {
            scrapedHTML[idx] = $(el).html() as string;
        });

    } catch (error) {
        console.error('Error while scraping data:', error);
    }
    return new Response(JSON.stringify(scrapedHTML));

};