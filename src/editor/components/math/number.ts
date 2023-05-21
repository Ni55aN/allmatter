import { ClassicPreset } from 'rete';
import { DiContainer, socket } from '../../index';

type Data = {
  value: number
}

export class NumberNode extends ClassicPreset.Node {
  height = 120;
  width = 180;

  static ID = 'number'

  constructor(di: DiContainer, data: Data) {
    super("Number");
    this.addControl(
      "value",
      new ClassicPreset.InputControl("number", { initial: data.value, change: di.process })
    );
    this.addOutput("value", new ClassicPreset.Output(socket, "Number"));
  }

  data(): { value: number } {
    return {
      value: (this.controls.value as ClassicPreset.InputControl<'number'>).value || 0
    };
  }

  serialize(): Data {
    return {
      value: (this.controls['value'] as ClassicPreset.InputControl<'number'>).value as number
    }
  }
}
