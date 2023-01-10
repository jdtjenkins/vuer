<template #default>
	<div
		v-if="currentLink"
		class="wrapper"
	>
		<p
			v-if="data.error"
			class="error"
			>
			Cannot find
			<a
				:href="link"
				target="_blank"
				class="italic"
			>{{ link }}</a>
		</p>

		<vuer-platform :link="currentLink" />

		<div class="subreddit-controls">
			<div class="desktop">
				<input
					type="number"
					v-model="data.intervalTime"
				>
				<a
					:href="currentLink.redditLink"
					target="_blank"
				>
					Reddit post
				</a>
				<a
					:href="currentLink.link"
					target="_blank"
				>
					Link
				</a>
				<a
					class="reddit-user"
					:href="currentLink.redditUserLink"
					target="_blank"
				>
					u/{{ currentLink.redditUser }}
				</a>
				<button @click="back">
					Back
				</button>
				<button @click="forward">
					Next
				</button>
				<button @click="stop" v-if="data.timer">
					Stop
				</button>
				<button @click="start" v-if="!data.timer">
					Start
				</button>
			</div>
			<div class="mobile">
				<button @click="showSettingsModal">
					<i>⚙</i>
					<teleport to="#modals">
						<vuer-modal :name="settingsModalName">
							<div class="modal-controls">
								<input
									type="number"
									v-model="data.intervalTime"
								>
								<a
									:href="currentLink.redditLink"
									target="_blank"
								>
									<i>Reddit</i>
								</a>
								<a
									:href="currentLink.link"
									target="_blank"
								>
									Go to link <i>👆</i>
								</a>
								<button @click="back">
									Back <i>👈</i>
								</button>
								<button @click="forward">
									Next <i>👉</i>
								</button>
								<button @click="stop" v-if="data.timer">
									<i>Stop</i>
								</button>
								<button @click="start" v-if="!data.timer">
									<i>Start</i>
								</button>
								<button class="close" @click.prevent.self="hideSettingsModal">
									Close
								</button>
							</div>
						</vuer-modal>
					</teleport>
				</button>
			</div>
		</div>
		<div class="subreddit-mobile-controls">
			<div class="controls">
				<button @click="back">
					<i>👈</i>
				</button>
				<button @click="forward">
					<i>👉</i>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { reactive, computed, ref, Ref, readonly, toRef } from "vue";
	import axios from 'axios';

	// Services
	import { LinkService } from '../../services/link-transform.service';
	import { useModalService } from '../../services/modal.service';

	// Interfaces
	import { FullLink } from '../../interfaces/link.interface';

	// Components
	import PlatformComponent from './platforms/platform.component.vue';
	import VuerModal from '../modal.component.vue';

	interface LinkWithRedditLink extends FullLink {
		redditLink?: string;
	}

	export default {
		name: 'subreddit-platform',
		props: ['link'],
		components: {
			'vuer-platform': PlatformComponent,
			'vuer-modal': VuerModal,
		},
		async setup(props: {link: string}, context: {emit: (...args: unknown[]) => void}) {
			const data = reactive({
				link: props.link,
				links: [],
				pageSize: 25,
				currentCount: 0,
				currentPage: null,
				after: null,
				timer: null,
				intervalTime: 30000,
				error: null,
				pause: false,
			});

			const getLinks = async () => {
				let response;

				try {
					response = await axios.get(`${ data.link }.json${ data.after ? `?after=${ data.after }` : '' }`);

					data.after = response.data.data.after;
				} catch {
					context.emit('subreddit-not-found', {
						link: data.link,
					});
					data.error = true;
					return;
				}

				const links = [];

				for (let child of response.data.data.children) {

					if (child.data.selftext !== '' && child.data.is_self) {
						continue;
					}

					try {
						const link = child.data.url;

						if (!link) {
							continue;
						}

						const redditLink = `https://www.reddit.com${ child.data.permalink }`;
						const linkData: LinkWithRedditLink = await LinkService.linkSwitch(link);

						if (!linkData) {
							continue;
						}

						linkData.redditLink = redditLink;
						linkData.redditUser = child.data.author;
						linkData.redditUserLink = `https://www.reddit.com/u/${ child.data.author }`;

						if (linkData) {
							links.push(linkData);
						}
					} catch(e) {
						console.log(e);
					}
				}

				data.links = [
					...data.links,
					...links,
				];
			}

			const setTimer = (time = 10000) => {
				reset();

				if (data.pause) {
					return;
				}

				data.timer = setInterval(async () => {
					await forward();
				}, data.intervalTime);
			}

			const now = () => {
				return performance.now();
			}

			const back = () => {
				if (data.currentCount === 0) {
					return;
				}

				data.currentCount--;
				setTimer();
			}

			const forward = async () => {
				if (data.currentCount + 1 > data.links.length - 1) {
					await getLinks();
				}

				data.currentCount++;

				setTimer();
			}

			const start = async () => {
				data.pause = false;
				setTimer();
			}

			const stop = async () => {
				data.pause = true;
				reset();
			}

			const reset = () => {
				if (data.timer) {
					clearInterval(data.timer);
					data.timer = null;
				}
			}

			const currentLink = computed(() => {
				if (data.links.length) {
					return toRef(data.links, data.currentCount).value;
				}
			});

			const settingsModalName = `${ performance.now() }-settings`;

			const modalService = useModalService();

			const showSettingsModal = () => {
				modalService.showModal(settingsModalName);
			}

			const hideSettingsModal = () => {
				modalService.hideModal(settingsModalName);
			}

			await Promise.all([getLinks(), setTimer()]);

			return {
				getLinks,
				setTimer,
				data,
				back,
				forward,
				stop,
				start,
				currentLink,
				settingsModalName,
				showSettingsModal,
				hideSettingsModal,
			}
		},
	}
</script>

<style lang="scss" scoped>
	.wrapper {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;

		&:hover {
			.subreddit-controls, .subreddit-mobile-controls {
				opacity: 1;
			}
		}

		a, button {
			border: 1px solid white;
			border-radius: 100px;
			cursor: pointer;
			font-size: 0.9rem;
			padding: 0.5rem 0.75rem;
			color: white;
			box-shadow: 0 0 5px rgba(0,0,0,0.2);
			background: transparent;
			transition: border-color .1s ease-out;

			@media screen and (min-width: 768px) {
				font-size: 1rem;
				padding: 0.5rem 1rem;
			}

			i {
				display: inline-block;
				line-height: 1rem;
				font-style: initial;
			}

			&:hover {
				border-color: lightcoral;
			}
		}

		.subreddit-controls {
			opacity: 0;
			transition: all .2s ease-in-out;

			a {
				text-decoration: none;
			}

			input {
				border: none;
				border-bottom: 1px solid #fff;
				width: 100px;
				text-align: center;
			}

			.desktop {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 75%;
				display: flex;
				align-items: flex-end;
				justify-content: flex-start;
				background: rgba(0,0,0,0);
				padding: 1rem;
				z-index: 2;
				flex-direction: column;
				display: none;

				@media screen and (min-width: 768px) {
					display: flex;
				}

				*:not(:last-child) {
					margin-bottom: 0.5rem;
				}
			}

			.mobile {
				display: block;
				position: absolute;
				top: 60px;
				left: 5px;
				width: 100%;

				@media screen and (min-width: 768px) {
					display: none;
				}

				.controls {
					position: absolute;
					bottom: 0;
					padding-left: 15px;
					right: 18px;
					width: 50%;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
			}
		}

		.subreddit-mobile-controls {
			opacity: 0;
			transition: all .2s ease-in-out;
			display: block;
			position: absolute;
			width: 100%;
			height: 50%;
			top: 50%;

			@media screen and (min-width: 768px) {
				display: none;
			}

			.controls {
				position: absolute;
				bottom: 15px;
				left: 0;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-around;
			}
		}
	}

	.error {
		padding: 0.5rem 0.75rem;
		background-color: pink;
		border-radius: 5px;
		border: none;
		box-shadow: 0 0 5px rgba(0,0,0,0.2);

		.italic {
			color: darken(pink, 15%);
			text-decoration: none;
			font-style: italic;

			&:hover {
				color: darken(pink, 20%);
			}
		}
	}

</style>

<style lang="scss">
	.modal-controls {
		a, button {
			background: pink;
			border: none;
			border-radius: 100px;
			font-size: 1rem;
			padding: 0.5rem 1rem;
			cursor: pointer;
			color: #383F51;
			box-shadow: 0 0 5px rgba(0,0,0,0.2);
			text-align: center;

			i {
				display: inline-block;
				line-height: 1rem;
				font-style: initial;
			}
		}

		a {
			color: inherit;
			text-decoration: none;
		}

		input {
			border: none;
			border-bottom: 1px solid #fff;
			background: rgba(0,0,0,0.2);
			color: #fff;
			text-align: center;
			padding: 10px;
		}

		button.close {
			background-color: darken(pink, 15%);
			color: white;
		}

		& > * {
			display: block;
			width: 100%;

			&:not(:last-child) {
				margin-bottom: 1rem;
			}
		}
	}
</style>
