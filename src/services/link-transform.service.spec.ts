/// <reference types="jest" />
import { LinkService } from './link-transform.service';

describe('LinkStore', () => {
	describe('createState', () => {
		it('State should be defined', () => {
			expect(LinkService).toBeDefined();
		});
	});

	describe('redditUser', () => {
		it('Should return a correctly transformed link when passed a full reddit user url', async () => {
			const url = "https://www.reddit.com/u/horse";

			const link = await LinkService.linkSwitch(url);

			expect(link).toMatchObject({
				link: url,
				platform: 'subreddit',
				transformedLink: 'https://www.reddit.com/user/horse'
			})
		});

		it('Should return a correctly transformed link when passed "u/horse"', async () => {
			const url = 'u/horse';

			const link = await LinkService.linkSwitch(url);

			expect(link).toMatchObject({
				link: url,
				platform: 'subreddit',
				transformedLink: 'https://www.reddit.com/user/horse'
			})
		});

		it('Should return a correctly transformed link when passed "/u/horse"', async () => {
			const url = '/u/horse';

			const link = await LinkService.linkSwitch(url);

			expect(link).toMatchObject({
				link: url,
				platform: 'subreddit',
				transformedLink: 'https://www.reddit.com/user/horse'
			})
		});
	});
});
