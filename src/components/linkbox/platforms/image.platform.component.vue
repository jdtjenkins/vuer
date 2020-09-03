<template>
    <img
        :src="link"
    >
</template>

<script>
    export default {
        name: 'image-platform',
		props: ['link'],
    }
</script>

<style lang="scss" scoped>
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
    }
</style>
