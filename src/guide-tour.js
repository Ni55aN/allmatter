import './style/tour.sass';
import 'tether-shepherd/dist/css/shepherd-theme-arrows.css';
import Shepherd from 'tether-shepherd';

export default class {
    constructor() {
        const tour = this.tour = new Shepherd.Tour({
            defaults: {
                classes: 'shepherd-theme-arrows'
            }
        });

        tour.addStep('start', {
            title: 'Welcome',
            text: `This web application is developed for<br>
                    creating 3D materials. More detailed <br>
                    information about the features of the<br>
                    application can be obtained from the 
                    <a href="./landing">link</a>.<br><br>
                    Click Next to go to the short overview of<br>
                    the application components`,
            attachTo: 'body center',
            buttons: this.getButtons(['Exit', 'Next'])
        });

        tour.addStep('menu', {
            title: 'Menu',
            text: `Using the menu, you can create, <br>
                open and save a project, change <br>
                the size of the texture and change <br>
                the 3D model in the material preview`,
            attachTo: 'header menu .item bottom',
            buttons: this.getButtons()
        });

        tour.addStep('material', {
            title: 'Material preview',
            text: 'Displays a 3D model and PBR material on it',
            attachTo: '.preview-material right',
            buttons: this.getButtons()
        });

        tour.addStep('node editor', {
            title: 'Node editor',
            text: 'Used to create a material using nodes and connections',
            attachTo: '.node-editor center',
            buttons: this.getButtons()
        });

        tour.addStep('node', {
            title: 'Node',
            text: 'The node performs some action <br>(in this case it blurs the texture)',
            attachTo: '.node.blur top',
            buttons: this.getButtons()
        });

        tour.addStep('node preview', {
            title: 'Texture preview in node',
            text: 'Displays the result of processing by this node<br> Click on it',
            attachTo: '.node.blur .control img top',
            buttons: this.getButtons()
        });

        tour.addStep('texture', {
            title: 'Texture preview',
            text: 'Displays the texture selected in the preview in node',
            attachTo: '.preview-texture right',
            buttons: this.getButtons()
        });

        tour.addStep('github', {
            title: 'Open-source',
            text: 'If you are web developer you can<br> contribute to app',
            attachTo: '.github bottom',
            buttons: this.getButtons()
        });

        tour.addStep('patreon', {
            title: 'Patreon',
            text: `If you liked the application and want<br>
                     to support the developer, you can do it<br>
                      via the Patreon`,
            attachTo: '.patron bottom',
            buttons: this.getButtons(['Exit', 'Back'])
        });

    }

    getButtons(names = ['Exit', 'Back', 'Next']) {
        const actions = {
            'Exit': this.tour.cancel,
            'Back': this.tour.back,
            'Next': this.tour.next
        };

        return names.map(name => ({
            text: name,
            classes: 'shepherd-button-' + (name === 'Exit'
                ? 'secondary'
                : 'primary'),
            action: actions[name]
        }));
    }

    start() {
        this
            .tour
            .start();
    }
}