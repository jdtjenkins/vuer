<template>
	<h2>Share</h2>
	<p>You can copy and paste this code into another Vuer window to copy your current board.</p>
	<pre>{{ linkHash }}</pre>
	<button @click="copyHash">Copy to clipboard 📋</button>
	<h2>Import</h2>
	<textarea
		placeholder="Paste your board code here"
		ref="textareaRef"
	></textarea>
	<button @click="importHash">Import</button>
</template>

<script lang="ts">
	import { toRaw, SetupContext, computed, ref } from 'vue';

	// Services
	import { useState } from '../../services/link.service';
	import StorageService from '../../services/storage.service';

	// Interfaces
	import { StateLink } from '../../interfaces/link.interface';

	export default {
		name: 'import-export',
		setup(props: any, context: SetupContext) {
			const { links, setState } = useState();

			const linkHash = computed(() => {
				const rawLinks = toRaw(links);

				return btoa(JSON.stringify(rawLinks));
			});

			const copyHash = () => {
				var textArea = document.createElement("textarea");
				textArea.value = linkHash.value;

				// Avoid scrolling to bottom
				textArea.style.top = "0";
				textArea.style.left = "0";
				textArea.style.position = "fixed";

				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();

				try {
					var successful = document.execCommand('copy');
				} catch (err) {
					console.error('Fallback: Oops, unable to copy', err);
				}

				document.body.removeChild(textArea);
			}

			const textareaRef = ref(null);

			const importHash = () => {
				const input = textareaRef.value;

				const newLinks = JSON.parse(atob(input.value));

				setState(newLinks);

				context.emit('done');
			}

			return {
				linkHash,
				copyHash,
				textareaRef,
				importHash,
			}
		}
	}
</script>

<style lang="scss" scoped>
	pre {
		max-width: 100%;
		height: auto;
		max-height: 500px;
		overflow: auto;
		white-space: pre-wrap;
		word-break: break-all;
		background-color: #e6e6e6;
		border: none;
		border-radius: 10px;
		padding: 1rem;
		color: darken(#e6e6e6, 60%);
		font-style: italic;
		font-family: 'Courier New', Courier, monospace;
		box-shadow: 0 0 2px rgba(0,0,0,0.1) inset;
	}

	button {
		border: 0;
		box-shadow: 0 0 3px 1px rgba(0,0,0,0.2);
		border-radius: 5px;
		padding: 0.5rem 1rem;
		margin: 0 auto;
		position: relative;
		display: inline-block;
		background: #e6e6e6;
		outline: none;

		&:active {
			background-color: darken(#e6e6e6, 10%);
		}
	}

	textarea {
		width: 100%;
		box-shadow: 0 0 2px rgba(0,0,0,0.1) inset;
		height: 150px;
		overflow: auto;
	}
</style>
