import { NodeEditor, NodeId } from 'rete';
import { DiContainer, Schemes } from "../editor"
import * as Nodes from './components';
import { Connection } from './connections';
import { NodeFactory } from './components/types';
import { Node } from './types';

export async function createNode(di: DiContainer, name: string, data: any) {
  const nodes = {
    [Nodes.InputNumber.ID]: () => new Nodes.InputNumber(di, data),
    [Nodes.InputTexture.ID]: () => new Nodes.InputTexture(di, data),
    [Nodes.InputCurve.ID]: () => new Nodes.InputCurve(di, data),
    [Nodes.InputColor.ID]: () => new Nodes.InputColor(di, data),

    [Nodes.Brick.ID]: () => new Nodes.Brick(di),
    [Nodes.Circle.ID]: () => new Nodes.Circle(di, data),
    [Nodes.Noise.ID]: () => new Nodes.Noise(di),

    [Nodes.NumberNode.ID]: () => new Nodes.NumberNode(di, data),
    [Nodes.Add.ID]: () => new Nodes.Add(),
    [Nodes.Subtract.ID]: () => new Nodes.Subtract(),
    [Nodes.Distance.ID]: () => new Nodes.Distance(),
    [Nodes.Divide.ID]: () => new Nodes.Divide(),
    [Nodes.Multiply.ID]: () => new Nodes.Multiply(),
    [Nodes.Pow.ID]: () => new Nodes.Pow(di, data),

    [Nodes.Blend.ID]: () => new Nodes.Blend(di),
    [Nodes.Blur.ID]: () => new Nodes.Blur(di, data),
    [Nodes.Invert.ID]: () => new Nodes.Invert(di),
    [Nodes.Lightness.ID]: () => new Nodes.Lightness(di, data),
    [Nodes.NormalMap.ID]: () => new Nodes.NormalMap(di, data),
    [Nodes.Gradient.ID]: () => new Nodes.Gradient(di),
    [Nodes.Transform.ID]: () => new Nodes.Transform(di, data),

    [Nodes.ModuleNode.ID]: async () => {
      const node = new Nodes.ModuleNode(di, data)

      await node.update()
      return node
    },
    [Nodes.OutputMaterial.ID]: () => new Nodes.OutputMaterial(di),

    [Nodes.OutputNumber.ID]: () => new Nodes.OutputNumber(data),
    [Nodes.OutputTexture.ID]: () => new Nodes.OutputTexture(data),
    [Nodes.OutputCurve.ID]: () => new Nodes.OutputCurve(data),
    [Nodes.OutputColor.ID]: () => new Nodes.OutputColor(data),
  }

  const matched = nodes[name]

  if (!matched) throw new Error(`Unsupported node '${name}'`);

  const node = await matched()

  return node
}

type Data = {
  nodes: { id: NodeId, name: string, data: Record<string, unknown> }[]
  connections: { id: NodeId, source: string, target: string, sourceOutput: keyof Node['outputs'], targetInput: keyof Node['inputs'] }[]
}

export async function importEditor(di: DiContainer, data: Data) {
  const { nodes, connections } = data;

  for (const n of nodes) {
    const node = await createNode(di, n.name, n.data);
    node.id = n.id;
    await di.editor.addNode(node);
  }
  for (const c of connections) {
    const source = di.editor.getNode(c.source);
    const target = di.editor.getNode(c.target);

    if (
      source &&
      target &&
      source.outputs[c.sourceOutput] &&
      target.inputs[c.targetInput]
    ) {
      const conn = new Connection(source, c.sourceOutput, target, c.targetInput);

      await di.editor.addConnection(conn);
    }
  }
}

export function exportEditor(editor: NodeEditor<Schemes>) {
  const nodes = [];
  const connections = [];

  for (const n of editor.getNodes()) {
    nodes.push({
      id: n.id,
      name: (n.constructor as NodeFactory).ID,
      data: n.serialize()
    });
  }
  for (const c of editor.getConnections()) {
    connections.push({
      source: c.source,
      sourceOutput: c.sourceOutput,
      target: c.target,
      targetInput: c.targetInput
    });
  }

  return {
    nodes,
    connections
  };
}
