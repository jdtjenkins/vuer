<template>
	<div class="grid">
		<div class="nav">
			<nav-component
				:layout="layout"
				@changeLayout="changeLayout"
			></nav-component>
		</div>
		<section class="links" :class="layout">
			<div
				v-for="(link, index) in links"
				v-bind:key="link.id"
				class="media"
			>
				<linkbox
					:linkProp="links[index].link"
					@updateLink="updateLink(link.id, $event)"
					@error="linkboxError"
				></linkbox>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
	import { computed, ref } from 'vue';
	import axios from 'axios';

	// Services
	import { useState } from '../services/link.service';

	// Components
	import NavComponent from './nav/nav.component.vue';
	import Linkbox from './linkbox/linkbox.component.vue';

	export default {
		name: 'vuer-component',
		components: {
			'nav-component': NavComponent,
			'linkbox': Linkbox,
		},
		setup() {
			const linkStoreState = useState();

			return {
				layout: ref('two-by-two'),
				links: linkStoreState.links,
				updateLink: linkStoreState.updateLink,
			}
		},
		methods: {
			changeLayout(layout) {
				this.layout = layout;
			},
			linkboxError(event, link) {
				console.log(event);
			},
		},
	}
</script>

<style lang="scss" scoped>
	.grid {
		height: 100vh;
		max-height: 100vh;
		width: 100%;
		overflow: hidden;
		display: grid;
		grid-template-rows: auto 40px;
		grid-template-columns: 100%;

		@media screen and (min-width: 768px) {
			grid-template-rows: 100%;
			grid-template-columns: 60px auto;

		}
	}

	.nav {
		grid-row: 2;

		@media screen and (min-width: 768px) {
			grid-column: 1;
			grid-row: 1;
		}
	}

	.links {
		display: grid;
		grid-template-rows: repeat(1, 100%);
		grid-template-columns: repeat(1, 100%);
		height: 100%;
		max-height: calc(100vh - 40px);
		background: #212529;

		@media screen and (min-width: 768px) {
			max-height: 100vh;
		}

		.media {
			align-items: center;
			justify-content: center;
			position: relative;
			flex-direction: column;
			width: 100%;
			height: 100%;
			display: none;

			&:hover {
				.controls {
					opacity: 1;
				}
			}

			video {
				width: 100%;
				max-width: 100%;
				max-height: 100%;
				z-index: 1;
				position: relative;
			}

			img {
				width: auto;
				max-width: 100%;
				max-height: 100%;
				z-index: 1;
				position: relative;
			}

			iframe {
				width: 100%;
				height: 100%;
				border: 0;
				background: none;
				z-index: 1;
				position: relative;
			}

			.linkbox {
				width: 100%;
				max-width: 100%;
				max-height: 100%;
				z-index: 1;
				position: relative;
			}
		}

		&.one-by-one {
			.media:nth-child(1) {
				display: flex;
			}
		}

		&.two-by-one {
			grid-template-rows: 100%;
			grid-template-columns: repeat(2, 1fr);

			.media:nth-child(1), .media:nth-child(2) {
				display: flex;
			}
		}

		&.one-by-two {
			grid-template-rows: repeat(2, minmax(50%, 50%));
			grid-template-columns: 100%;

			.media:nth-child(1), .media:nth-child(2) {
				display: flex;
			}
		}

		&.two-by-two {
			grid-template-rows: repeat(2, 50%);
			grid-template-columns: repeat(2, 50%);

			.media:nth-child(1),
			.media:nth-child(2),
			.media:nth-child(3),
			.media:nth-child(4) {
				display: flex;
			}
		}

		&.three-by-three {
			grid-template-rows: repeat(3, 33%);
			grid-template-columns: repeat(3, 33%);

			.media {
				display: flex;
			}
		}
	}
</style>
