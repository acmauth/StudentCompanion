export type RecentItemType = 'recentGrade' | 'notification';

export interface RecentItem {
	type: RecentItemType;
	content: any;
	id: number;
}
