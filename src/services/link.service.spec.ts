/// <reference types="jest" />
import { createState } from './link.service';

// Interfaces
import { StateLink } from '../interfaces/link.interface';

describe('LinkStore', () => {
	describe('createState', () => {
		it('State should be defined', () => {
			const state = createState();

			expect(state).toBeDefined();
		});

		it('State links should be an array of 9 elements', () => {
			const state = createState();

			expect(state.links).toBeInstanceOf(Array);
			expect(state.links).toHaveLength(9);
		});
	});

	describe('state.updateLink', () => {
		it ('Should update the first link', () => {
			const state = createState();
			const link = 'https://vuer.xyz';
			const platform = 'embed';

			expect(state.links[0].link).toBe(null);

			state.updateLink(1, link);

			expect(state.links[0]).toMatchObject(<StateLink>{
				id: 1,
				link,
			})
		})
	});

	describe('state.resetLink', () => {
		it('Should reset the first link', () => {
			const state = createState();

			state.updateLink(1, 'hammertime');

			expect(state.links[0].link).toBe('hammertime');

			state.resetLink(1);

			expect(state.links[0]).toMatchObject(<StateLink>{
				id: 1,
				link: null as unknown as string,
			})
		});
	});
});
