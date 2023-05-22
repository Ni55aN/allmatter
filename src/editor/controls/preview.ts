import { ClassicPreset } from 'rete';

export class Preview extends ClassicPreset.Control {
    texture: null | WebGLTexture = null

    constructor(public onUpdate: () => void, public onClick: (texture: { canvas: HTMLCanvasElement }) => void) {
        super()
    }

    setTexture(texture: WebGLTexture) {
        this.texture = texture
        this.onUpdate()
    }
}
