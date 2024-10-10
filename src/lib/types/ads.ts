type department = string;
type semester = number;
type study_level = string;

interface Filter {
	name: string;
	value: (department | semester | study_level)[];
}

interface Content {
	title: string;
	description: string;
	image: string;
	link: string;
}

interface Advert {
	id: string;
	filters: Filter[];
	content: Content;
}

type Advertisements = Advert[];
