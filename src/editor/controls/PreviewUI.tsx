import { useMemo } from 'react'
import { Preview } from './preview'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Texturity from 'texturity.js';
import { legacyStore } from '../../store';

export function PreviewUI(props: { data: Preview }) {
    const width = 140
    const height = 140
    function texture2src(texture: WebGLTexture, w: number, h: number): string {
        const c = new Texturity.Canvas(w, h);

        c.drawTexture(texture, 0, 0, w, h);
        const src = c.toSrc();

        return src;
    }
    const src = useMemo(() => {
        if (!props.data.texture) return ''
        return texture2src(props.data.texture, width, height)
    }, [props.data.texture])


    return (
        <img src={src} width={width + 'px'} height={height + 'px'} onPointerDown={e => {
            e.stopPropagation()
            const src = props.data.texture
                ? texture2src(props.data.texture, legacyStore.textureSize, legacyStore.textureSize)
                : ''

            props.data.onClick({ src })
        }} />
    )
}
