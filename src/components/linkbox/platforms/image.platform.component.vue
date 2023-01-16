<template>
    <img
        :src="link"
		:class="imageClasses"
		ref="image"
    >
</template>

<script>
	import { ref, computed } from 'vue';

    export default {
        name: 'image-platform',
		props: ['link'],
		setup(props, ctx) {
			const image = new Image();
			const isImagePortrait = ref(false);
			const imageClasses = computed(() => ({
				portrait: isImagePortrait,
				landscape: !isImagePortrait
			}));

			image.onload = () => {
				isImagePortrait.value = image.value?.naturalHeight > image.value?.naturalWidth;
				console.warn('loaded')
				ctx.emit('loaded');
			};

			image.src = props.link;

			return {
				imageClasses,
			}
		},
    }
</script>

<style lang="scss" scoped>
	img {
		min-height: 100%;
		min-width: 100%;
		object-fit: cover;
		object-position: center;
		pointer-events: none;

		&.landscape {
			width: 100%;
		}

		@media screen and (min-width: 768px) {
			min-height: auto;
			max-width: 100%;
			max-height: 100%;
			object-fit: contain;
		}
	}
</style>
