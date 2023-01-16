<template>
    <iframe
        :src="link"
        allowfullscreen="true"
        scrolling="no"
		ref="iframe"
    ></iframe>
</template>

<script>
	import { ref, watchEffect } from 'vue';

    export default {
        name: 'embed-platform',
        props: ['link'],
		setup(_, ctx) {
			const iframe = ref();

			watchEffect(() => {
				if (iframe.value?.contentDocument?.readyState !== 'complete') {
					return;
				}

				console.warn('loaded')

				ctx.emit('loaded');
			});

			return {
				iframe,
			}
		}
    }
</script>

<style lang="scss" scoped>
    iframe {
        width: 100%;
        height: 100%;
        border: none;
		pointer-events: none;
    }
</style>
