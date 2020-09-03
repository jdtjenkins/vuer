<template>
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
	}
</script>
