import Vue from 'vue';

import About from './components/About.vue';
import Header from './components/Header/index.vue';
import Hub from './components/Hub/index.vue';
import Tour from './guide-tour';
import Workspace from './components/Workspace.vue';
import store from './store';

new Vue({
    el: '#app',
    template: '<div><Header/><Workspace/><About/><Hub/></div>',
    provide: {
        tour: new Tour()
    },
    components: {
        Header,
        Workspace,
        About,
        Hub
    },
    store
});