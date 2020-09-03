import { createApp } from 'vue'

// Components
import Vuer from './components/vuer.component.vue';

// Service
import { stateSymbol, createState } from './services/link.service';
import { ModalServiceSymbol, createModalService } from './services/modal.service';

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/service-worker.js');
	});
}

const app = createApp(Vuer);
app.provide(stateSymbol, createState());
app.provide(ModalServiceSymbol, createModalService());
app.mount('#app')
