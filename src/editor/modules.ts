import { ClassicPreset, NodeEditor } from "rete";
import { DataflowEngine } from "rete-engine";
import { InputColor } from './components/input/color';
import { InputCurve } from './components/input/curve';
import { InputTexture } from './components/input/texture';
import { OutputNumber } from './components/output/number';
import { OutputColor } from './components/output/color';
import { OutputCurve } from './components/output/curve';
import { OutputTexture } from './components/output/texture';
import { InputNumber } from './components/input/number';
import { Schemes } from '.';


export type Module = {
  apply: (editor: NodeEditor<Schemes>) => Promise<void>;
  exec: (data: Record<string, any>) => Promise<any>;
};

export class Modules {
  constructor(
    private has: (path: string) => boolean,
    private graph: (path: string, editor: NodeEditor<Schemes>) => Promise<void>
  ) { }

  public findModule = (path: string): null | Module => {
    if (!this.has(path)) return null;

    return {
      apply: (editor: NodeEditor<Schemes>) => this.graph(path, editor),
      exec: async (inputData: Record<string, any>) => {
        const engine = new DataflowEngine<Schemes>();
        const editor = new NodeEditor<Schemes>();

        editor.use(engine);

        await this.graph(path, editor);

        return this.execute(inputData, editor, engine);
      }
    };
  };

  private async execute(
    inputs: Record<string, any>,
    editor: NodeEditor<Schemes>,
    engine: DataflowEngine<Schemes>
  ) {
    const nodes = editor.getNodes();

    this.injectInputs(nodes, inputs);

    return this.retrieveOutputs(nodes, engine);
  }

  private static isInputNode<S extends Schemes>(node: S['Node']): node is S['Node'] & { inputValue: any } {
    return node instanceof InputColor
      || node instanceof InputNumber
      || node instanceof InputCurve
      || node instanceof InputTexture
  }

  private injectInputs(nodes: Schemes["Node"][], inputData: Record<string, any>) {
    const inputNodes = nodes.filter(Modules.isInputNode)

    inputNodes.forEach((node) => {
      const key = (node.controls['name'] as ClassicPreset.InputControl<'text'>).value;
      if (key) {
        node.inputValue = inputData[key] && inputData[key][0];
      }
    });
  }

  private static isOutputNode<S extends Schemes>(node: S["Node"]): node is S['Node'] & { outputValue: any } {
    return node instanceof OutputNumber
      || node instanceof OutputColor
      || node instanceof OutputCurve
      || node instanceof OutputTexture
  }

  private async retrieveOutputs(nodes: Schemes["Node"][], engine: DataflowEngine<Schemes>) {
    const outputNodes = nodes.filter(Modules.isOutputNode)
    const outputs = await Promise.all(
      outputNodes.map(async (outNode) => {
        const data = await engine.fetch(outNode.id);

        const key = (outNode.controls['name'] as ClassicPreset.InputControl<'text'>).value

        if (!key) throw new Error('cannot get output node name')

        return [key, data.value] as const;
      })
    );

    return Object.fromEntries(outputs);
  }

  public static getPorts(editor: NodeEditor<Schemes>) {
    const nodes = editor.getNodes();
    const inputs = nodes
      .filter(Modules.isInputNode)
      .map((n) => (n.controls.name as ClassicPreset.InputControl<'text'>).value as string);
    const outputs = nodes
      .filter(Modules.isOutputNode)
      .map((n) => (n.controls.name as ClassicPreset.InputControl<'text'>).value as string);

    return {
      inputs,
      outputs
    };
  }
}
