import { getLocale } from '$lib/i18n';

export interface ProcessedMenuData {
	cafeteriaData: string[];
	breakfastData: string;
	lunchData: string;
	dinnerData: string;
	menuDate: string;
	message?: string;
	color?: string;
}

/**
 * Process menu data and extract meal sections
 * @param menuData - The raw menu data array
 * @param today - The day index (0 for Monday, 6 for Sunday)
 * @param initialMessage - The initial cafeteria status message
 * @param initialColor - The initial status color
 * @param t - The translation function
 * @returns Processed menu data with extracted sections
 */
export function processMenuData(
	menuData: string[], 
	today: number, 
	initialMessage: string = '', 
	initialColor: string = 'success',
	t: (key: string) => string
): ProcessedMenuData {
	if (!menuData || menuData.length === 0) {
		throw new Error('No menu data available');
	}

	// Extract today's menu text
	const todayMenuText = menuData[today];
	
	// Extract the date from today's menu
	let dateRegex: RegExp;
	if (getLocale() === 'en') {
		dateRegex = /Date of Menu\s*:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i;
	} else {
		dateRegex = /Πρόγραμμα Συσσιτίου\s*:\s*(\d{2}\/\d{2}\/\d{4})/;
	}
	
	let menuDate = '';
	let message = initialMessage;
	let color = initialColor;
	
	const matchDate = todayMenuText.match(dateRegex);
	if (matchDate) {
		menuDate = matchDate[1];
	}

	// Validate menuDate format (should be DD/MM/YYYY)
	const dateValidationRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
	if (!dateValidationRegex.test(menuDate)) {
		menuDate = new Date().toLocaleDateString('en-GB');
	}
	// Check if the cafeteria is closed for vacation
	else if (menuDate !== new Date().toLocaleDateString('en-GB')) {
		message = t('menu.closedForHolidays');
		color = 'danger';
	}

	// Extract all three meal sections for today
	const breakfastData = extractMealSection(todayMenuText, 'breakfast');
	const lunchData = extractMealSection(todayMenuText, 'lunch');
	const dinnerData = extractMealSection(todayMenuText, 'dinner');

	return {
		cafeteriaData: menuData,
		breakfastData,
		lunchData,
		dinnerData,
		menuDate,
		message,
		color
	};
}

/**
 * Helper function to format menu text with proper HTML structure
 * @param text - The raw menu text to format
 * @param skipFirstLines - Whether to skip day name and date lines
 * @returns Formatted HTML string
 */
export function formatMenuText(text: string, skipFirstLines: boolean = true): string {
	if (!text) return '';
	
	// Remove asterisks from the text
	text = text.replace(/\*/g, '');
	
	// Split by lines and process
	const lines = text.split('\n').filter(line => line.trim());
	let formattedHTML = '';
	let inBreakfastSection = false;
	let breakfastContent: string[] = [];
	
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		
		// Handle the day name (first line) - skip it
		if (i === 0 && skipFirstLines) continue;
		
		// Handle the date line - it might be on line 1, 2, or 3 depending on splitting
		if (skipFirstLines && i <= 3) {
			const dateMatch = line.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
			if (dateMatch) {
				formattedHTML += `<p class="menu-date">📅 ${dateMatch[1]}</p>`;
				continue;
			}
			// Skip lines that are part of the date header (like "Πρόγραμμα Συσσιτίου" or "Date of Menu")
			if (line.match(/^(Πρόγραμμα Συσσιτίου|Date of Menu|:)$/i)) {
				continue;
			}
		}
		
		// Check if line is a meal section header (Πρωινό, Μεσημεριανό, Βραδινό, Breakfast, Lunch, Dinner)
		if (line.match(/^(Πρωινό|Μεσημεριανό|Βραδινό|Breakfast|Lunch|Dinner)$/)) {
			// If we were in breakfast section, flush the accumulated content
			if (inBreakfastSection && breakfastContent.length > 0) {
				formattedHTML += `<p class="menu-item breakfast-content">${breakfastContent.join(' ')}</p>`;
				breakfastContent = [];
			}
			
			formattedHTML += `<h2 class="meal-header">${line}</h2>`;
			inBreakfastSection = line === 'Πρωινό' || line === 'Breakfast';
		}
		// Check if line is a time range
		else if (line.match(/\(.*?\d{2}:\d{2}.*?\)/)) {
			// Always format time ranges the same way, even in breakfast
			if (inBreakfastSection && breakfastContent.length > 0) {
				// Flush breakfast content before showing time
				formattedHTML += `<p class="menu-item breakfast-content">${breakfastContent.join(' ')}</p>`;
				breakfastContent = [];
			}
			formattedHTML += `<p class="meal-time">${line}</p>`;
		}
		// Check if line is a category header (in caps or bold-looking)
		else if (line.match(/^[A-ZΑ-Ω\s]+$/) && line.length < 50) {
			// If we were in breakfast section, flush the accumulated content
			if (inBreakfastSection && breakfastContent.length > 0) {
				formattedHTML += `<p class="menu-item breakfast-content">${breakfastContent.join(' ')}</p>`;
				breakfastContent = [];
			}
			
			formattedHTML += `<h3 class="category-header">${line}</h3>`;
			inBreakfastSection = false;
		}
		// Check if line contains "επιλογή από" or "selection from"
		else if (line.match(/επιλογή από|selection from/i)) {
			formattedHTML += `<p class="selection-note"><em>${line}</em></p>`;
		}
		// Skip standalone parentheses
		else if (line.match(/^[\(\)]+$/)) {
			continue;
		}
		// All other lines
		else {
			if (inBreakfastSection) {
				// Just accumulate everything in breakfast
				breakfastContent.push(line);
			} else {
				formattedHTML += `<p class="menu-item">${line}</p>`;
			}
		}
	}
	
	// Flush any remaining breakfast content
	if (breakfastContent.length > 0) {
		formattedHTML += `<p class="menu-item breakfast-content">${breakfastContent.join(' ')}</p>`;
	}
	
	return formattedHTML;
}

/**
 * Helper function to extract a specific meal section from menu text
 * @param menuText - The full menu text for a day
 * @param mealName - The meal to extract ('breakfast', 'lunch', or 'dinner')
 * @returns The extracted meal section text
 */
export function extractMealSection(menuText: string, mealName: string): string {
	const lines = menuText.split('\n');
	let mealStartIndex = -1;
	let mealEndIndex = lines.length;
	
	// Define all possible meal headers
	const breakfastHeaders = ['Πρωινό', 'Breakfast'];
	const lunchHeaders = ['Μεσημεριανό', 'Lunch'];
	const dinnerHeaders = ['Βραδινό', 'Dinner'];
	
	let currentMealHeaders: string[] = [];
	let nextMealHeaders: string[] = [];
	
	if (mealName === 'breakfast') {
		currentMealHeaders = breakfastHeaders;
		nextMealHeaders = lunchHeaders;
	} else if (mealName === 'lunch') {
		currentMealHeaders = lunchHeaders;
		nextMealHeaders = dinnerHeaders;
	} else if (mealName === 'dinner') {
		currentMealHeaders = dinnerHeaders;
		nextMealHeaders = []; // Dinner is the last meal
	}
	
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		
		// Check if this line matches the current meal
		if (currentMealHeaders.some(header => line === header)) {
			mealStartIndex = i;
		}
		
		// Check if this line matches the next meal (end of current meal section)
		if (mealStartIndex !== -1 && nextMealHeaders.length > 0 && 
			nextMealHeaders.some(header => line === header)) {
			mealEndIndex = i;
			break;
		}
	}
	
	// Extract the meal section
	if (mealStartIndex !== -1) {
		const mealLines = lines.slice(mealStartIndex, mealEndIndex);
		return mealLines.join('\n');
	}
	
	return '';
}
