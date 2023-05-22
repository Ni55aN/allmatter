/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import * as Texturity from 'texturity.js';
import { ClassicPreset, GetSchemes, NodeEditor } from 'rete';
import { DataflowEngine } from 'rete-engine';
// @ts-ignore
import { saveAs } from 'file-saver';
import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { ContextMenuExtra, ContextMenuPlugin, Presets as ContextMenuPresets } from 'rete-context-menu-plugin';
import { ReactArea2D, ReactRenderPlugin, Presets } from 'rete-react-render-plugin';
import { debounce } from 'lodash';
// @ts-ignore
import blobUtil from 'blob-util/dist/blob-util';
import { createRoot } from "react-dom/client";
import * as Nodes from './components';
import { Preview } from './controls/preview';
import { PreviewUI } from './controls/PreviewUI';
import { ColorPicker } from './controls/color-picker';
import { ColorPickerUI } from './controls/ColorPickerUI';
import { importEditor } from './import-export';
import { Modules } from './modules';
import { ConnProps, Node } from './types'
import { getConnectionSockets } from './utils';

export const socket = new ClassicPreset.Socket("socket");

export type Schemes = GetSchemes<Node, ConnProps>;

type AreaExtra = ReactArea2D<Schemes> | ContextMenuExtra;

export type DiContainer = {
  updateControl: (id: string) => void
  updateNode: (id: string) => void
  updatePreview: (texture: { src: string }) => void
  process: () => void
  updateMaterial: (maps: Record<string, any>) => void
  editor: NodeEditor<Schemes>
  modules: Modules
}

export async function createEditor(
  container: HTMLElement,
  getModuleData: () => any,
  updateMaterial: (maps: Record<string, any>) => void,
  updatePreview: (texture: { src: string }) => void,
  log: (message: string, type: "info" | "error") => void
) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactRenderPlugin<Schemes, AreaExtra>({ createRoot });
  const arrange = new AutoArrangePlugin<Schemes>();
  const engine = new DataflowEngine<Schemes>();

  Texturity.clearCache();
  Texturity.initGL('webgl2');

  function _process() {
    engine.reset();
    Texturity.disposeTextures();

    editor
      .getNodes()
      .filter((n) => n instanceof Nodes.OutputMaterial)
      .forEach((n) => {
        engine.fetch(n.id)
      })
  }
  const process = debounce(_process, 500)
  const modules = new Modules(
    (path) => getModuleData()[path],
    async (path, editor) => {
      const data = getModuleData()[path];

      if (!data) throw new Error("cannot find module");
      await importEditor(
        {
          process: () => null,
          updatePreview: () => null,
          updateMaterial: () => null,
          updateNode: () => null,
          updateControl: () => null,
          editor,
          modules
        },
        data
      );
    }
  );

  const di: DiContainer = {
    process,
    updatePreview,
    updateMaterial,
    updateNode: (id) => area.update('node', id),
    updateControl: (id) => area.update('control', id),
    editor,
    modules
  }
  const contextMenu = new ContextMenuPlugin<Schemes>({
    items: ContextMenuPresets.classic.setup([
      ["Input", [
        ["Number", () => new Nodes.InputNumber(di, { name: '', number: 1 })],
        ["Texture", () => new Nodes.InputTexture(di, { name: '' })],
        ["Curve", () => new Nodes.InputCurve(di, { name: '' })],
        ["Color", () => new Nodes.InputColor(di, { name: '', defaultColor: 'white' })]
      ]],
      ["Generator", [
        ["Brick", () => new Nodes.Brick(di)],
        ["Circle", () => new Nodes.Circle(di, { size: 0.5 })],
        ["Noise", () => new Nodes.Noise(di)]
      ]],
      ["Math", [
        ["Number", () => new Nodes.NumberNode(di, { value: 0 })],
        ["Add", () => new Nodes.Add()],
        ["Subtract", () => new Nodes.Subtract()],
        ["Distance", () => new Nodes.Distance()],
        ["Divide", () => new Nodes.Divide()],
        ["Multiply", () => new Nodes.Multiply()],
        ["Pow", () => new Nodes.Pow(di, { pow: 2 })]
      ]],
      ["Texture", [
        ["Blend", () => new Nodes.Blend(di)],
        ["Blur", () => new Nodes.Blur(di, { radius: 1 })],
        ["Invert", () => new Nodes.Invert(di)],
        ["Lightness", () => new Nodes.Lightness(di, { scalar: 1 })],
        ["Normal map", () => new Nodes.NormalMap(di, { scale: 1 })],
        ["Gradient", () => new Nodes.Gradient(di)],
        ["Transform", () => new Nodes.Transform(di, { x: 0, y: 0, repeat: 0 })],
      ]],
      ["Module", () => new Nodes.ModuleNode(di, { path: 'path to module..' })],
      ["Material", () => new Nodes.OutputMaterial(di)],
      ["Output", [
        ["Number", () => new Nodes.OutputNumber({ name: ' ' })],
        ["Texture", () => new Nodes.OutputTexture({ name: '' })],
        ["Curve", () => new Nodes.OutputCurve({ name: '' })],
        ["Color", () => new Nodes.OutputColor({ name: '' })]
      ]]
    ])
  });
  area.use(contextMenu);

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  render.addPreset(Presets.contextMenu.setup({ delay: 200 }));
  render.addPreset(Presets.classic.setup({
    customize: {
      control(data) {
        if (data.payload instanceof ColorPicker) return ColorPickerUI
        if (data.payload instanceof Preview) return PreviewUI
        return Presets.classic.InputControl as any
      },
    }
  }));

  connection.addPreset(ConnectionPresets.classic.setup());

  arrange.addPreset(ArrangePresets.classic.setup());

  editor.use(engine);
  editor.use(area);
  area.use(connection);
  area.use(render);
  area.use(arrange);

  AreaExtensions.simpleNodesOrder(area);
  AreaExtensions.showInputControl(area);

  editor.addPipe((context) => {
    if (["connectioncreated", "connectionremoved"].includes(context.type)) {
      process();
    }
    return context;
  });
  editor.addPipe((context) => {
    if (context.type === "connectioncreate") {
      const { data } = context;
      const { source, target } = getConnectionSockets(editor, data);

      if (!source.isCompatibleWith(target)) {
        log("Sockets are not compatible", "error");
        return;
      }
    }
    return context;
  });

  function zoomAt() {
    AreaExtensions.zoomAt(area, editor.getNodes())
  }

  return {
    di,
    editor,
    process,
    destroy: () => area.destroy(),
    layout: () => arrange.layout(),
    zoomAt
  }
}
