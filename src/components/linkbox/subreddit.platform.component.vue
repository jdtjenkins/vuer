<template #default>
	<div
		v-if="currentLink"
		class="wrapper"
		ref="wrapper"
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

		<div
			class="loading"
			:class="{ 'show-loading': data.showLoading }"
		></div>

		<vuer-platform
			:link="currentLink"
			@loaded="hideLoader"
		/>

		<div class="subreddit-controls subreddit-controls-desktop">
			<input
				type="number"
				v-model="data.intervalTime"
			>
			<a
				class="reddit-link"
				:href="currentLink.redditLink"
				target="_blank"
			>
				<img src="/snoo.png" class="reddit-logo">
				<span>{{ currentLink.redditTitle  }}</span>
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
			<button @pointerup="back">
				Back
			</button>
			<button @pointerup="forward">
				Next
			</button>
			<button @pointerup="stop" v-if="data.timer">
				Stop
			</button>
			<button @pointerup="start" v-if="!data.timer">
				Start
			</button>
		</div>
		<div
			class="subreddit-controls subreddit-controls-mobile"
			:class="{ 'show-controls': showControls }"
		>
			<div class="left">
				<button @pointerup.stop.prevent="showSettingsModal">
					<i>⚙</i>
					<teleport to="#modals">
						<vuer-modal :name="settingsModalName">
							<div class="modal-controls">
								<input
									type="number"
									v-model="data.intervalTime"
								>
								<button @pointerup="stop" v-if="data.timer">
									<i>Stop</i>
								</button>
								<button @pointerup="start" v-if="!data.timer">
									<i>Start</i>
								</button>
								<button class="close" @pointerup.stop.prevent.self="hideSettingsModal">
									Close
								</button>
							</div>
						</vuer-modal>
					</teleport>
				</button>
			</div>
			<div class="right">
				<a
					class="reddit-link"
					:href="currentLink.redditLink"
					target="_blank"
					@pointerup.stop.prevent
				>
					<img src="/snoo.png" class="reddit-logo">
					<span>{{ currentLink.redditTitle  }}</span>
				</a>
				<a
					:href="currentLink.link"
					target="_blank"
					@pointerup.stop.prevent
				>
					Link
				</a>
				<a
					class="reddit-user"
					:href="currentLink.redditUserLink"
					target="_blank"
					@pointerup.stop.prevent
				>
					u/{{ currentLink.redditUser }}
				</a>
			</div>
			<div class="bottom">
				<button @pointerup.stop.prevent="back">
					Back
				</button>
				<button @pointerup.stop.prevent="forward">
					Next
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
		props: ['link', 'showControls'],
		components: {
			'vuer-platform': PlatformComponent,
			'vuer-modal': VuerModal,
		},
		async setup(props: {link: string, showControls: boolean}, context: {emit: (...args: unknown[]) => void}) {
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
				showLoading: false,
			});

			const wrapper = ref();

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
						linkData.redditTitle = child.data.title;

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

			const showLoader = () => {
				data.showLoading = true;
			}

			const hideLoader = () => {
				data.showLoading = false;
			}

			const back = () => {
				if (data.currentCount === 0) {
					return;
				}

				data.currentCount--;
				setTimer();
				showLoader();
			}

			const forward = async () => {
				if (data.currentCount + 1 > data.links.length - 1) {
					await getLinks();
				}

				data.currentCount++;

				setTimer();
				showLoader();
			}

			const start = async (event) => {
				event.preventDefault();
				event.stopPropagation();
				data.pause = false;
				setTimer();
			}

			const stop = async (event) => {
				event.preventDefault();
				event.stopPropagation();
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
				wrapper,
				hideLoader,
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
		overflow: hidden;

		@media screen and (min-width: 768px) {
			&:hover {
				.subreddit-controls {
					opacity: 1;
					pointer-events: all;
				}
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
			background: rgba(0,0,0,0.5);
			transition: border-color, background-color .1s ease-out;

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
				background-color: rgba(0,0,0,0.2);
			}
		}

		.subreddit-controls {
			opacity: 0;
			transition: all .2s ease-in-out;

			a {
				text-decoration: none;
				display: block;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				text-align: center;

				img.reddit-logo {
					width: 21px;
					height: 21px;
					min-width: 21px;
					min-height: 21px;
					margin-bottom: 0 !important;
					margin-right: 0.5rem;
				}

				& > span {
					max-width: 200px;
				}

				& > * {
					vertical-align: middle;
				}

				&.reddit-link {
					border-color: #ff4500;

					&:hover {
						border-color: darken(#ff4500, 10%);
					}
				}
			}

			*:not(:last-child) {
				margin-bottom: 0.5rem;
			}

			input {
				border: none;
				border-bottom: 1px solid #fff;
				width: 100px;
				text-align: center;
			}

			&.subreddit-controls-desktop {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 75%;
				display: flex;
				align-items: flex-end;
				justify-content: flex-start;
				padding: 1rem;
				z-index: 2;
				flex-direction: column;
			}

			&.subreddit-controls-mobile {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				display: flex;
				align-items: flex-start;
				justify-content: center;
				gap: 0.5rem;
				pointer-events: none;

				&.show-controls {
					opacity: 1;
					pointer-events: all;
				}

				.left {
					position: absolute;
					left: 1rem;
					top: 60px;
				}

				.right {
					position: absolute;
					bottom: 5rem;
					right: 1rem;
					width: 50%;
				}

				.bottom {
					position: absolute;
					bottom: 15px;
					left: 0;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-around;
				}

				@media screen and (min-width: 768px) {
					display: none;
				}
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

	.loading {
		width: 48px;
		height: 48px;
		display: inline-block;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateY(-50%) translateX(-50%);
		opacity: 0;

		&.show-loading {
			opacity: 1;
		}
	}

	.loading::after,
	.loading::before {
		content: '';
		box-sizing: border-box;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 2px solid pink;
		position: absolute;
		left: 0;
		top: 0;
		animation: animloading 2s linear infinite;

	}

	.loading::after {
		animation-delay: 1s;
	}

	@keyframes animloading {
		0% {
			transform: scale(0);
			opacity: 1;
		}
		100% {
			transform: scale(1);
			opacity: 0;
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
