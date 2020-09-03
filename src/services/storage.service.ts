// Interfaces
import { State } from '../interfaces/state.interface';
import { StateLink } from '../interfaces/link.interface';

interface StorageState {
	[name: string]: State;
}

export default class StorageService {
	public static readonly localStorageKey: string = 'VuerStorage';

	/**
	 * Save a board. Send an array of StateLinks. This represents one board
	 */
	public static save(payload: {
		links: StateLink[],
		name: string,
	}) {
		const currentState = StorageService.load();

		const newState: StorageState = {
			...currentState,
			[payload.name]: {
				links: payload.links,
			},
		}

		StorageService.setState(newState);
	}

	/**
	 * Load a specific board from localStorage, or get all saved boards
	 */
	public static load(): StorageState;
	public static load(name: string): State;
	public static load(name?: string): State | StorageState {
		const state: string = window.localStorage.getItem(StorageService.localStorageKey);

		const parsedState: StorageState = JSON.parse(state);

		if (!state) {
			return <State>{};
		}

		if (!!name && !parsedState[name]) {
			return <State>{
				links: [],
			}
		}

		if (!name) {
			return parsedState;
		}

		return <State>parsedState[name];
	}

	public static delete(): void;
	public static delete(name: string): void;
	public static delete(name?: string): void {
		if (!name) {
			StorageService.clear();
			return;
		}

		const state = StorageService.load();

		delete state[name];

		StorageService.setState(state);
	}

	public static setState(state: StorageState): void {
		window.localStorage.setItem(StorageService.localStorageKey, JSON.stringify(state));
	}

	public static get names(): string[] {
		return Object.keys(StorageService.load());
	}

	public static clear(): void {
		window.localStorage.clear();
	}
}
