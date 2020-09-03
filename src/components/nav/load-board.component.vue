<template>
	<section class="modal-state" id="modal-load-name">
		<div v-if="boards.length === 0">
			You have no saved boards 🤷‍♀️
		</div>
		<div v-if="boards.length">
			<p>Choose a board:</p>
			<ul>
				<li
					v-for="name in boards"
					v-bind:key="name.id"
					@click.self.prevent="loadBoard(name)"
				>
					{{ name }}
					<button
						type="button"
						name="delete-board"
						@click.self.prevent="deleteBoard(name)"
					>Delete</button>
				</li>
			</ul>
		</div>
	</section>
</template>

<script lang="ts">
	import { reactive, toRef, SetupContext } from 'vue';

	// Services
	import { useState as linkService } from '../../services/link.service';
	import StorageService from '../../services/storage.service';

	// Interfaces
	import { StateLink } from '../../interfaces/link.interface';

	export default {
		name: 'save-form',
		setup(props: any, context: SetupContext) {
			const { setState } = linkService();

			let boards = reactive(StorageService.names);

			const loadBoard = (name: string) => {
				const state = StorageService.load(name);

				setState(state.links);

				context.emit('done');
			}

			const deleteBoard = (name: string) => {
				StorageService.delete(name);

				const index = boards.indexOf(name);

				boards.splice(index, 1);
			}

			return {
				boards,
				loadBoard,
				deleteBoard,
			}
		},
	}
</script>

<style lang="scss" scoped>
	#modal-load-name {
		ul {
			list-style: none;
			margin: 0;
			padding: 0;
		}

		li {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #e6e6e6;
			text-align: left;
			padding: 0.5rem 1rem;
			border-radius: 5px;
			border: 1px solid #e3e3e3;
			transition: background-color 0.2s ease-in-out;
			cursor: pointer;

			&:hover {
				background-color: pink;

				button {
					background-color: lighten(pink, 5%);
				}
			}

			&:not(:last-child) {
				margin-bottom: 1rem;
			}

			button {
				border: none;
				text-align: center;
				padding: 0.5rem 1rem;
				border-radius: 50px;
				box-shadow: 0 0 2px rgba(0,0,0,0.2);
				background-color: pink;
				cursor: pointer;
				transition: background-color 0.1s ease-in-out;

				&:hover {
					background-color: lighten(pink, 10%);
				}
			}
		}
	}
</style>
