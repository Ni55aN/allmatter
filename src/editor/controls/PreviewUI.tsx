import { useEffect, useRef } from 'react'
import { Preview } from './preview'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Texturity from 'texturity.js';
import { legacyStore } from '../../store';

export function PreviewUI(props: { data: Preview }) {
    const width = 140
    const height = 140
    const ref = useRef<HTMLDivElement>(null)

    function texture2canvas(texture: WebGLTexture, w: number, h: number): HTMLCanvasElement {
        const c = new Texturity.Canvas(w, h);

        c.drawTexture(texture, 0, 0, w, h);

        return c.toCanvas(w, h)
    }
    useEffect(() => {
        if (!props.data.texture) return
        if (!ref.current) return
        const size = legacyStore.textureSize
        const canvas = texture2canvas(props.data.texture, size, size)
        canvas.style.width = '100%'
        ref.current.innerHTML = ''
        ref.current.appendChild(canvas)
    }, [props.data.texture, ref.current])


    return (
        <div
            ref={ref}
            style={{ width: `${width}px`, height: `${height}px` }}
            onPointerDown={e => {
                e.stopPropagation()
                const canvas = props.data.texture
                    ? texture2canvas(props.data.texture, legacyStore.textureSize, legacyStore.textureSize)
                    : document.createElement('canvas')

                props.data.onClick({ canvas })
            }}
        ></div>
    )
}
