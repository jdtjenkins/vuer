/// <reference types="cypress" />

context('Links', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000');
	});

	it('It should correctly load up an "i.imgur" image', () => {
		cy
			.get('#app > div.grid > section.links > div.media:nth-child(1) > .linkbox > input[type=text]')
			.type('https://i.imgur.com/tizUUgG.png{enter}')

		cy
			.get('#app > div.grid > section.links > div.media:nth-child(1) > .linkbox > img', {
				timeout: 5000,
			})
			.should('exist');
	});

	it('It should correctly load up an gfycat mp4', () => {
		cy
			.get('#app > div.grid > section.links > div.media:nth-child(1) > .linkbox > input[type=text]')
			.type('https://gfycat.com/defiantchiefbighornsheep{enter}')

		cy
			.get('#app > div.grid > section.links > div.media:nth-child(1) > .linkbox > video', {
				timeout: 5000,
			})
			.should('exist');
	});

	it('2x2 - Should correctly load an image in all 4 slots', () => {
		cy
			.get('#app > div.grid > section.links > div.media:nth-child(1) > .linkbox > input[type=text]')
			.type('https://i.imgur.com/tizUUgG.png{enter}');

		cy
			.get('#app > div.grid > section.links > div.media:nth-child(2) > .linkbox > input[type=text]')
			.type('https://i.imgur.com/tizUUgG.png{enter}');

		cy
			.get('#app > div.grid > section.links > div.media:nth-child(3) > .linkbox > input[type=text]')
			.type('https://i.imgur.com/tizUUgG.png{enter}')

		cy
			.get('#app > div.grid > section.links > div.media:nth-child(4) > .linkbox > input[type=text]')
			.type('https://i.imgur.com/tizUUgG.png{enter}');

		cy
			.get('#app > div.grid > section.links > div.media:nth-child(1) > .linkbox > img', {
				timeout: 5000,
			})
			.should('exist');

		cy
			.get('#app > div.grid > section.links > div.media:nth-child(2) > .linkbox > img', {
				timeout: 5000,
			})
			.should('exist');

		cy
			.get('#app > div.grid > section.links > div.media:nth-child(3) > .linkbox > img', {
				timeout: 5000,
			})
			.should('exist');

		cy
			.get('#app > div.grid > section.links > div.media:nth-child(4) > .linkbox > img', {
				timeout: 5000,
			})
			.should('exist');
	});
});
