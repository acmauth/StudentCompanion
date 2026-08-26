import type { RecentItem } from './types';

export type PeriodKey = 'today' | 'yesterday' | 'this_week' | 'earlier';

export interface PeriodGroup {
	period: PeriodKey;
	items: RecentItem[];
}

const PERIOD_ORDER: PeriodKey[] = ['today', 'yesterday', 'this_week', 'earlier'];
const DAY_MS = 86_400_000;

export function getItemDate(item: RecentItem): Date {
	if (item.type === 'recentGrade') return new Date(item.content.gradeModified);
	if (item.type === 'notification') return new Date(item.content.dateReceived);
	return new Date(0);
}

function getPeriodKey(item: RecentItem): PeriodKey {
	const now = new Date();
	const date = getItemDate(item);
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today.getTime() - DAY_MS);
	const weekAgo = new Date(today.getTime() - 6 * DAY_MS);
	const itemDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	if (itemDay.getTime() === today.getTime()) return 'today';
	if (itemDay.getTime() === yesterday.getTime()) return 'yesterday';
	if (itemDay >= weekAgo) return 'this_week';
	return 'earlier';
}

export function groupItemsByPeriod(items: RecentItem[]): PeriodGroup[] {
	const grouped: Partial<Record<PeriodKey, RecentItem[]>> = {};

	for (const item of items) {
		const key = getPeriodKey(item);
		(grouped[key] ??= []).push(item);
	}

	return PERIOD_ORDER
		.filter((period) => grouped[period]?.length)
		.map((period) => ({ period, items: grouped[period]! }));
}
