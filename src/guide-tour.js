import Shepherd from 'tether-shepherd';
import 'tether-shepherd/dist/css/shepherd-theme-arrows.css';

export default class {
    constructor() {
        this.tour = new Shepherd.Tour({
            defaults: {
                classes: 'shepherd-theme-arrows'
            }
        });

        this
            .tour
            .addStep('example', {
                title: 'Guide',
                text: 'Coming soom...',
                attachTo: '.region canvas'
            });
    }

    start() {
        this
            .tour
            .start();
    }
}