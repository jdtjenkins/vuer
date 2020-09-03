<template>
	<form id="save-form" name="save-form" @submit.prevent="saveBoard">
		<label>
			<span>Choose a name for this board</span>
			<input
				type="text"
				name="name"
				autocomplete="false"
			>
		</label>
		<input type="submit" value="Submit">
	</form>
</template>

<script lang="ts">
	import { toRef, SetupContext } from 'vue';

	// Services
	import { useState } from '../../services/link.service';
	import StorageService from '../../services/storage.service';

	// Interfaces
	import { StateLink } from '../../interfaces/link.interface';

	export default {
		name: 'save-form',
		setup(props: any, context: SetupContext) {
			const { links } = useState();

			const saveBoard = form => {
				const formData = new FormData(form.target);

				StorageService.save({
					name: formData.get('name') as string,
					links: links as StateLink[],
				});

				context.emit('done');
			}

			return {
				saveBoard,
			}
		}
	}
</script>

<style lang="scss" scoped>
	#save-form {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		label {
			display: block;
			width: 100%;
			text-align: center;
			margin-bottom: 1rem;

			input[type="text"] {
				appearance: none;
				border: none;
				border-bottom: 1px solid rgba(0,0,0,.4);
				text-align: center;
				padding: .5rem .25rem;
				outline: none;
				width: 60%;
				margin-bottom: 1rem;
			}
		}

		span {
			margin-right: 1rem;
			margin-bottom: 1rem;
			display: block;
		}

		input[type="submit"] {
			border: none;
			text-align: center;
			padding: 0.5rem 0.25rem;
			border-radius: 50px;
			box-shadow: 0 0 10px rgba(0,0,0,0.2);
			width: 50%;
			background-color: pink;
			cursor: pointer;

			&:hover {
				background-color: darken(pink, 10%);
			}
		}
	}
</style>
