import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css'

export class Tour {
  tour: Shepherd.Tour

  constructor() {
    const tour = this.tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: 'shepherd-theme-arrows'
      }
    });

    tour.addStep({
      title: 'Welcome',
      text: `This web application is developed for<br>
                    creating 3D materials. More detailed <br>
                    information about the features of the<br>
                    application can be obtained from the
                    <a href="./landing">link</a>.<br><br>
                    Click Next to go to the short overview of<br>
                    the application components`,
      attachTo: {
        element: 'body'
      },
      buttons: this.getButtons(['Exit', 'Next'])
    });

    tour.addStep({
      title: 'Menu',
      text: `Using the menu, you can create, <br>
                open and save a project, change <br>
                the size of the texture and change <br>
                the 3D model in the material preview`,
      attachTo: {
        element: '[data-tour="menu"] > *',
        on: 'bottom'
      },
      buttons: this.getButtons()
    });

    tour.addStep({
      title: 'Material preview',
      text: 'Displays a 3D model and PBR material on it',
      attachTo: {
        element: '[data-tour="material-preview"]',
        on: 'right'
      },
      buttons: this.getButtons()
    });

    tour.addStep({
      title: 'Node editor',
      text: 'Used to create a material using nodes and connections',
      attachTo: {
        element: '[data-tour="node-editor"]',
        on: 'left'
      },
      buttons: this.getButtons()
    });

    tour.addStep({
      title: 'Node',
      text: 'The node performs some action <br>(in this case it blurs the texture)',
      attachTo: {
        element: () => {
          const blurTitle = Array.from(document.querySelectorAll('[data-testid="title"]')).find(el => el.textContent === 'Blur')
          const blurNode = blurTitle?.parentElement

          return blurNode
        },
        on: 'left'
      },
      buttons: this.getButtons()
    });

    tour.addStep({
      title: 'Texture preview in node',
      text: 'Displays the result of processing by this node<br> Click on it',
      attachTo: {
        element: () => {
          const blurTitle = Array.from(document.querySelectorAll('[data-testid="title"]')).find(el => el.textContent === 'Blur')
          const blurNode = blurTitle?.parentElement?.querySelector('img')

          return blurNode
        },
        on: 'left'
      },
      buttons: this.getButtons()
    });

    tour.addStep({
      title: 'Texture preview',
      text: 'Displays the texture selected in the preview in node',
      attachTo: {
        element: '[data-tour="texture-preview"]',
        on: 'right'
      },
      buttons: this.getButtons()
    });

    tour.addStep({
      title: 'Open-source',
      text: 'If you are web developer you can<br> contribute to app',
      attachTo: {
        element: '[data-tour="github"]',
        on: 'bottom'
      },
      buttons: this.getButtons()
    });

    tour.addStep({
      title: 'Patreon',
      text: `If you liked the application and want<br>
                     to support the developer, you can do it<br>
                      via the Patreon`,
      attachTo: {
        element: '[data-tour="patreon"]',
        on: 'bottom'
      },
      buttons: this.getButtons(['Exit', 'Back'])
    });

  }

  getButtons(names = ['Exit', 'Back', 'Next']) {
    const actions: Record<string, () => void> = {
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
