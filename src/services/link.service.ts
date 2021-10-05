import { computed, reactive, readonly, inject } from 'vue';

// interfaces
import { StateLink } from '../interfaces/link.interface';

interface LinkStore {
	links: readonly StateLink[],
	updateLink: (id: number, link: string) => void,
	resetLink: (id: number) => void,
	setState: (links: StateLink[]) => void,
	comp: any,
}

const generateLink: (id: number) => StateLink = (id: number): StateLink => ({
	id,
	link: null as unknown as string,
});


export const stateSymbol = Symbol('state');

export const createState = (): LinkStore => {
	const links: StateLink[] = reactive([
		generateLink(1),
		generateLink(2),
		generateLink(3),
		generateLink(4),
		generateLink(5),
		generateLink(6),
		generateLink(7),
		generateLink(8),
		generateLink(9),
	]);

	const updateLink = (id: number, link: string): void => {
		const linkToUpdate = links.find(link => link.id === id);

		linkToUpdate!.link = link;
	}

	const resetLink = (id: number): void => {
		const linkToUpdate = links.find(link => link.id === id);

		Object.assign(linkToUpdate, generateLink(id));
	}

	const setState = (linksToSet: StateLink[]): void => {
		linksToSet.forEach(link => updateLink(link.id!, link.link));
	}

	const comp = computed(() => {
		return links
	});

	return {
		links: readonly(links),
		resetLink,
		updateLink,
		setState,
		comp,
	};
};

export const useState: () => LinkStore = () => inject(stateSymbol) as LinkStore;
