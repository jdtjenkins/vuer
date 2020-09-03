<template>
    <iframe
        :src="link"
        allowfullscreen="true"
        scrolling="no"
    ></iframe>
</template>

<script>
    export default {
        name: 'embed-platform',
        props: ['link'],
    }
</script>

<style lang="scss" scoped>
    iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
</style>
