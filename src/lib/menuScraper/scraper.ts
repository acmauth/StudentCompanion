import axios from 'axios';
import { getLocale } from '$lib/i18n';
import { getMenuFromCache, saveMenuToCache, isCacheValid } from './menuCache';

export async function getMenu() {
    try {
        const locale = getLocale();
        const apiUrl = `https://api.aristomate.gr/menu?locale=${locale}`;
        
        const response = await axios.get(apiUrl, { timeout: 5000 });
        const menuData = response.data.menu;
        
        // Save to cache for future use
        if (menuData && Array.isArray(menuData)) {
            await saveMenuToCache(menuData);
        }
        
        return menuData;

    } catch (error) {
        console.error('Error while fetching menu data:', error);
        
        // Try to get cached data as fallback
        const cachedMenu = await getMenuFromCache();
        if (cachedMenu) {
            console.log('Using cached menu data');
            return cachedMenu;
        }
        
        return "Error while fetching menu data";
    }
}
