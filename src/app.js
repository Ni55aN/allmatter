import Vue from 'vue';

import About from './components/About.vue';
import AppHeader from './components/header/AppHeader.vue';
import Hub from './components/hub/Hub.vue';
import Tour from './guide-tour';
import Workspace from './components/Workspace.vue';
import store from './store';

new Vue({
    el: '#app',
    provide: {
        tour: new Tour()
    },
    components: {
        AppHeader,
        Workspace,
        About,
        Hub
    },
    store
});