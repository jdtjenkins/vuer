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
		setup(props) {
			const image = new Image();
			const isImagePortrait = ref(false);
			const imageClasses = computed(() => ({
				portrait: isImagePortrait,
				landscape: !isImagePortrait
			}));

			image.onload = () => {
				console.log(image.naturalHeight > image.naturalWidth);
				isImagePortrait.value = image.value?.naturalHeight > image.value?.naturalWidth;
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
		height: 100%;
		object-fit: contain;
		object-position: center;

		&.landscape {
			width: 100%;
		}
	}
</style>
