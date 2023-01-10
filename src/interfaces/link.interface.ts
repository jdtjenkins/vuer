import { State } from "./state.interface";

export interface StateLink {
	id?: number;
	link: string;
}

export interface FullLink extends StateLink {
	platform: string;
	show?: boolean;
	transformedLink?: string;
	mp4?: string;
	redditUser?: string;
	redditUserLink?: string;
}
