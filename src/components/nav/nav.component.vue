<template>
	<nav>
		<button
			type="button"
			name="two-by-two"
			@click="changeLayout('one-by-one')"
			v-bind:class="{active: layout === 'one-by-one'}">1x1</button>
		<button
			type="button"
			name="two-by-two"
			@click="changeLayout('two-by-two')"
			v-bind:class="{active: layout === 'two-by-two'}">2x2</button>
		<button
			type="button"
			name="two-by-two"
			@click="changeLayout('three-by-three')"
			v-bind:class="{active: layout === 'three-by-three'}">3x3</button>
		<button
			type="button"
			name="two-by-one"
			@click="changeLayout('two-by-one')"
			v-bind:class="{active: layout === 'two-by-one'}">2x1</button>
		<button
			type="button"
			name="one-by-two"
			@click="changeLayout('one-by-two')"
			v-bind:class="{active: layout === 'one-by-two'}">1x2</button>
		<div class="seperator"></div>
		<button
			type="button"
			name="save"
			@click="showModal('import-export')">Share</button>
		<button
			type="button"
			name="save"
			@click="showModal('save-board')">Save</button>
		<button
			type="button"
			name="load"
			@click="showModal('load-board')">Load</button>
		<button
			type="button"
			name="version"
			class="version"
			@click="showModal('changelog')">v2.2.0</button>

		<!-- Modals -->
		<teleport to="#modals">
			<vuer-modal name="save-board">
				<save-board
					@done="hideModal('save-board')"
				/>
			</vuer-modal>
			<vuer-modal name="load-board">
				<load-board
					@done="hideModal('load-board')"
				/>
			</vuer-modal>
			<vuer-modal name="changelog">
				<vuer-changelog>
					<template v-slot:controls>
						<button
							type="button"
							@click="hideModal('changelog')">Close</button>
					</template>
				</vuer-changelog>
			</vuer-modal>
			<vuer-modal name="import-export">
				<import-export
					@done="hideModal('import-export')"
				/>
			</vuer-modal>
		</teleport>
	</nav>
</template>

<script>
	import axios from 'axios';

	// Services
	import StorageService from '../../services/storage.service';
	import { useModalService } from '../../services/modal.service';

	// Component
	import ModalComponent from '../modal.component.vue';
	import ChangelogComponent from '../changelog.component.vue';
	import SaveBoardComponent from './save-board.component.vue';
	import LoadBoardComponent from './load-board.component.vue';
	import ImportExportComponent from './import-export.component.vue';

	export default {
		name: 'nav-component',
		components: {
			'vuer-modal': ModalComponent,
			'vuer-changelog': ChangelogComponent,
			'save-board': SaveBoardComponent,
			'load-board': LoadBoardComponent,
			'import-export': ImportExportComponent,
		},
		props: [
			'layout',
		],
		setup() {
			const { showModal, hideModal } = useModalService();

			return {
				showModal,
				hideModal,
			}
		},
		data() {
			return {
				savedStates: [],
			}
		},
		methods: {
			changeLayout(layout) {
				this.$emit('changeLayout', layout);
			},
		},
	}
</script>

<style lang="scss" scoped>
	nav {
		background-color: #343a40;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-direction: row;
		height: 100%;
		width: 100%;
		overflow: scroll hidden;
		color: #f2fdff;

		@media screen and (min-width: 768px) {
			flex-direction: column;
			overflow: hidden;
		}

		button {
			width: 40%;
			min-width: 40%;
			padding: 1rem 0.5rem;
			font-size: 0.9rem;
			background: none;
			border: 0;
			cursor: pointer;
			color: #f2fdff;

			@media screen and (min-width: 768px) {
				width: 100%;
				min-width: 100%;
			}

			&:hover {
				background: #212529;
			}

			&.active {
				background: #212529;
			}
		}

		.seperator {
			flex-grow: 2;
			margin-top: auto;
		}

		p.version {
			color: #f2fdff;
			text-align: center;
			font-size: 0.75rem;
			padding: 0.5rem;
		}
	}
</style>
