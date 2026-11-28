type PageSnapshot<T> = {
	get: () => T | null;
	set: (data: T) => void;
	clear: () => void;
};

const snapshots = new Set<PageSnapshot<unknown>>();

// In-memory copy of what a tab page last rendered. Tab navigation remounts the
// page component, so it can draw from this instantly while it refreshes.
// Create it in the page's `<script context="module">` so it outlives the instance.
export function createPageSnapshot<T>(): PageSnapshot<T> {
	let value: T | null = null;
	const snapshot: PageSnapshot<T> = {
		get: () => value,
		set: (data) => {
			value = data;
		},
		clear: () => {
			value = null;
		}
	};
	snapshots.add(snapshot as PageSnapshot<unknown>);
	return snapshot;
}

export function clearPageSnapshots() {
	snapshots.forEach((snapshot) => snapshot.clear());
}
