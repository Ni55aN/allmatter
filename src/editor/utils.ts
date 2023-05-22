// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Texturity from 'texturity.js';
import { ClassicPreset } from "rete";
import { BaseSchemes, NodeEditor, NodeId } from "rete";
import { legacyStore } from '../store'
import { Schemes } from '.';
import { Socket } from './sockets';

function getColor(type: string) {
    switch (type) {
        case 'normal':
            return [128, 255, 128, 255];

        case 'white':
            return [255, 255, 255, 255];

        default:
            return [0, 0, 0, 255];
    }
}

export default {
    createEmptyTexture(type: string) {
        const gl = Texturity.getGL();
        const data = new Uint8Array(getColor(type));
        const emptyTexture: WebGLTexture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return emptyTexture;
    },
    createMockCanvas() {
        return new Texturity.Canvas(legacyStore.textureSize, legacyStore.textureSize);
    },
    createMockTexture(type: string) {
        return this.createEmptyTexture(type);
    },
    textureToCanvas(texture: WebGLTexture): HTMLCanvasElement {
        const w = legacyStore.textureSize;
        const h = legacyStore.textureSize;
        const canvas = new Texturity.Canvas(w, h);

        return canvas
            .drawTexture(texture, 0, 0, w, h)
            .toCanvas(w, h)
    }
}

export async function removeConnections(
    editor: NodeEditor<BaseSchemes>,
    nodeId: NodeId
) {
    for (const c of [...editor.getConnections()]) {
        if (c.source === nodeId || c.target === nodeId) {
            await editor.removeConnection(c.id);
        }
    }
}

export async function clearEditor(editor: NodeEditor<BaseSchemes>) {
    for (const c of [...editor.getConnections()]) {
        await editor.removeConnection(c.id);
    }
    for (const n of [...editor.getNodes()]) {
        await editor.removeNode(n.id);
    }
}

type Input = ClassicPreset.Input<Socket>;
type Output = ClassicPreset.Output<Socket>;

export function getConnectionSockets(
    editor: NodeEditor<Schemes>,
    connection: Schemes["Connection"]
) {
    const source = editor.getNode(connection.source);
    const target = editor.getNode(connection.target);

    const output =
        source &&
        (source.outputs as Record<string, Input>)[connection.sourceOutput];
    const input =
        target && (target.inputs as unknown as Record<string, Output>)[connection.targetInput];

    return {
        source: output?.socket,
        target: input?.socket
    };
}
