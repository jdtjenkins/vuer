<template>
	<video-platform
		v-if="link.platform === 'video'"
		:link="link"
		@loaded="loaded"
	></video-platform>

	<image-platform
		v-else-if="link.platform === 'image'"
		:link="link.transformedLink"
		@loaded="loaded"
	></image-platform>

	<embed-platform
		v-else-if="link.platform === 'embed'"
		:link="link.transformedLink"
		@loaded="loaded"
	></embed-platform>
</template>

<script lang="ts">
	// Components
	import VideoPlatform from './video.platform.component.vue';
	import ImagePlatform from './image.platform.component.vue';
	import EmbedPlatform from './embed.platform.component.vue';

	export default {
		props: ['link'],
		components: {
			'video-platform': VideoPlatform,
			'embed-platform': EmbedPlatform,
			'image-platform': ImagePlatform,
		},
		setup(_, ctx) {
			const loaded = () => {
				ctx.emit('loaded');
			}

			return {
				loaded,
			}
		},
	}
</script>
