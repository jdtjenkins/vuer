<template>
	<video
		v-if="link.platform === 'video'"
		autoplay
		controls
		loop
		muted
		:poster="link.poster"
		ref="video"
	>
		<source
			v-if="link.mp4"
			:src="link.mp4"
			type="video/mp4"
		>
		<source
			v-else
			:src="link.link"
			type="video/mp4"
		>
	</video>
</template>

<script>
	import { ref, onUpdated, watchEffect } from 'vue';

	export default {
		name: 'video-platform',
		props: ['link'],

		setup(_, ctx) {
			const video = ref();

			watchEffect(() => {
				if (!video.value) {
					return;
				}

				video.value.addEventListener('loadeddata', () => {
					console.warn('loaded')
					ctx.emit('loaded');
				});
			})

			onUpdated(() => {
				video.value?.load();
			});

			return {
				video,
			}
		}
	}
</script>

<style lang="scss" scoped>
	video {
		min-height: 100%;
		min-width: 100%;
		object-fit: cover;
		object-position: center;
		pointer-events: none;

		@media screen and (min-width: 768px) {
			min-height: auto;
			max-width: 100%;
			max-height: 100%;
			object-fit: contain;
		}
	}
</style>
