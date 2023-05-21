import { ClassicPreset } from 'rete';
import sockets from '../../sockets';
import { Preview } from '../../controls/preview';
import { DiContainer } from '../../index';

export class CommonTexture extends ClassicPreset.Node {

    constructor(label: string, di: DiContainer) {
        super(label)

        const out = new ClassicPreset.Output(sockets.image, 'Image');
        const ctrl: Preview = new Preview(() => di.updateControl(ctrl.id), di.updatePreview)

        this.addControl('preview', ctrl)
        this.addOutput('image', out);
    }

    updatePreview(texture: WebGLTexture) {
        if (!(texture instanceof WebGLTexture))
            throw new Error('Need Canvas instance');

        (this.controls['preview'] as Preview).setTexture(texture)
    }
}
