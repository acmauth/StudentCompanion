
import axios from 'axios';
import { getMenuFromCache, saveMenuToCache } from './menuCache';
import Config from "$src/app.config";
import DOMPurify from 'dompurify';
import { getLocale } from '../i18n';

export async function getMenu() {
    try {
        const apiUrl = `${Config.menu.apiBase}?locale=${getLocale()}`;

        const response = await axios.get(apiUrl, { timeout: 5000 });
        console.log(getLocale(), "Menu API URL:", apiUrl, "Response:", response.data);
        let days = response.data?.menu?.days;
        const club_open = response.data?.club_open;

        // Sanitize HTML in days array and cache
        if (days && Array.isArray(days)) {
            days = days.map(day => typeof day === 'string' ? DOMPurify.sanitize(day, { SANITIZE_NAMED_PROPS: true }) : day);
            await saveMenuToCache(days);
        }

        // Return ordered array of days (Monday=0, Sunday=6)
        return { days: days, club_open: club_open };

    } catch (error) {
        console.error('Error while fetching menu data:', error);

        // Try to get cached data as fallback
        const cachedMenu = await getMenuFromCache();
        if (cachedMenu) {
            console.log('Using cached menu data');
            return { days: cachedMenu, clup_open: undefined };
        }

        return "Error while fetching menu data";
    }
}
