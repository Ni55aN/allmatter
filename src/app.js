import AppHeader from './components/header/AppHeader.vue';
import Workspace from './components/Workspace.vue';
import About from './components/About.vue';
import Hub from './components/hub/Hub.vue';
import quideTour from './guide-tour';

import Vue from 'vue';
import store from './store';

new Vue({
    el: '#app',
    components: {
        AppHeader,
        Workspace,
        About,
        Hub
    },
    store
});