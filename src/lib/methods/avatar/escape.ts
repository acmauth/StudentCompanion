// Minimal XML-escape helper, API-compatible with @dicebear/core's `escape.xml`.
// The vendored part dictionaries call `escape.xml(...)` when injecting colors.

const XML_ENTITIES: Record<string, string> = {
	'<': '&lt;',
	'>': '&gt;',
	'&': '&amp;',
	"'": '&apos;',
	'"': '&quot;'
};

export const escape = {
	xml: (value: string): string => String(value).replace(/[<>&'"]/g, (char) => XML_ENTITIES[char])
};
