<template>
	<div
		id="overlay"
		:class="{ visible: visible }"
		@click.self="hide"
	>
		<div id="modal" v-if="visible">
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
	import { ref, readonly } from 'vue';
	import { useModalService } from '../services/modal.service';

	export default {
		name: 'vuer-modal',
		props: ['name'],
		setup(props: {name: string}) {
			const { addModal } = useModalService();

			const visible = ref(false);

			const show: () => void = () => {
				visible.value = true;
			}

			const hide = () => {
				visible.value = false;
			}

			addModal(props.name, {
				show,
				hide,
			});

			return {
				visible: readonly(visible),
				hide,
			}
		},
	}
</script>

<style lang="scss">
	#overlay {
		height: 100vh;
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0,0,0,0.11);
		opacity: 0;
		pointer-events: none;
		z-index: 2;
		transition: opacity 0.2s ease;

		&.visible {
			opacity: 1;
			pointer-events: all;
		}

		#modal {
			position: relative;
			z-index: 2;
			height: auto;
			width: 100%;
			margin: 0 1rem;
			padding: 1.5rem 1rem;
			border-radius: 10px;
			background-color: white;
			border: 0;
			box-shadow: 0 0 10px -2px rgba(0,0,0,0.3);
			max-height: 90vh;
			overflow: auto;

			@media screen and (min-width: 768px) {
				width: 50%;
				margin: 0;
			}
		}
	}
</style>
