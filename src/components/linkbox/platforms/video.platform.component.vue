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
	import { ref, onUpdated } from 'vue';

	export default {
		name: 'video-platform',
		props: ['link'],

		setup() {
			const video = ref();

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
		max-height: 100%;
		object-fit: contain;
		object-position: center;
	}
</style>
