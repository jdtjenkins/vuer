<template>
	<div
		class="linkbox"
		@pointerup.stop.prevent="toggleControls"
	>
		<div
			v-if="link.link"
			class="controls"
			:class="{ 'show-controls': showControls }"
		>
			<button
				type="button"
				name="button"
				class="reset-button"
				@click="resetLink">Reset</button>
		</div>

		<input
			v-if="!link.transformedLink"
			type="text"
			placeholder="Reddit, Subreddit, Imgur, Gfycat, Youtube, Twitch url"
			v-model="link.link"
			autocomplete="false"
			@change="updateLink($event.target.value)"
		>

		<video-platform
			v-if="link.platform === 'video'"
			:link="link"
		></video-platform>

		<image-platform
			v-else-if="link.platform === 'image'"
			:link="link.transformedLink"
		></image-platform>

		<embed-platform
			v-else-if="link.platform === 'embed'"
			:link="link.transformedLink"
		></embed-platform>

		<Suspense v-else-if="link.platform === 'subreddit'">
			<subreddit-platform
				v-if="link.platform === 'subreddit'"
				:link="link.transformedLink"
				:show-controls="showControls"
			></subreddit-platform>
		</Suspense>

	</div>
</template>

<script lang="ts">
	import { reactive, readonly, defineAsyncComponent, SetupContext, watch, ref } from 'vue';

	// Services
	import { LinkService } from '../../services/link-transform.service';

	// Components
	import VideoPlatform from './platforms/video.platform.component.vue';
	import ImagePlatform from './platforms/image.platform.component.vue';
	import EmbedPlatform from './platforms/embed.platform.component.vue';
	import PlatformComponent from './platforms/platform.component.vue';

	// Interfaces
	import { FullLink } from '../../interfaces/link.interface';

	export default {
		name: 'linkbox',
		props: ['linkProp'],
		components: {
			'video-platform': VideoPlatform,
			'subreddit-platform': defineAsyncComponent(() => import('./subreddit.platform.component.vue')),
			'embed-platform': EmbedPlatform,
			'image-platform': ImagePlatform,
			'vuer-platform': PlatformComponent,
		},
		setup(
			props: {
				linkProp: string,
			},
			context: SetupContext,
		) {
			let showControls = ref(true);
			let link = reactive(<FullLink>{
				link: null,
				platform: null,
				transformedLink: null,
				mp4: null,
			});

			const updateLink = async (url: string): Promise<void> => {
				const partialLink = await LinkService.linkSwitch(url);

				Object.assign(link, partialLink);

				context.emit('updateLink', link.link);
			}

			const resetLink = (): void => {
				link.link = null;
				link.platform = null;
				link.transformedLink = null;
				link.mp4 = null;
			}

			if (props.linkProp) {
				(async () => {
					await updateLink(props.linkProp);
				})();
			}

			watch(
				() => props.linkProp,
				async newLink => {
					resetLink();
					await updateLink(newLink);
				},
			);

			const toggleControls = () => {
				setTimeout(() => showControls.value = !showControls.value, 100);
			}

			return {
				link,
				updateLink,
				resetLink,
				showControls,
				toggleControls,
			};
		},
	}
</script>

<style lang="scss" scoped>
	.linkbox {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;

		@media screen and (min-width: 768px) {
			&:hover {
				.controls {
					opacity: 1;
				}
			}
		}

		input[type="text"] {
			appearance: none;
			border: none;
			border-bottom: 1px solid rgba(255,255,255,0.4);
			text-align: center;
			padding: 0.5rem 0.25rem;
			outline: none;
			width: 60%;
			background: none;
			color: white;

			&::-webkit-input-placeholder {
				transition: color 0.2s ease-in-out;
				color: rgba(255,255,255, 0.4);
			}

			&:focus {
				&::-webkit-input-placeholder {
					color: rgba(255,255,255,0.1);
				}
			}
		}

		.controls {
			position: absolute;
			top: 1rem;
			left: 0;
			width: 50%;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			opacity: 0;
			transition: all .2s ease-in-out;
			background: rgba(0,0,0,0);
			z-index: 3;
			padding-left: 1rem;

			&.show-controls {
				opacity: 1;
			}

			@media screen and (min-width: 768px) {
				padding: 1rem;
			}

			button {
				background: transparent;
				border: 1px solid pink;
				border-radius: 100px;
				font-size: 0.9rem;
				padding: 0.5rem 0.75rem;
				cursor: pointer;
				color: pink;
				box-shadow: 0 0 5px rgba(0,0,0,0.2);
				background-color: rgba(0,0,0,0.3);

				@media screen and (min-width: 768px) {
					padding: 0.75rem 1rem;
				}
			}
		}
	}
</style>
