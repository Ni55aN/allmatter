import { Connection } from './connections'
import * as Nodes from './components'

export type Node =
  | Nodes.NumberNode
  | Nodes.Add
  | Nodes.OutputMaterial
  | Nodes.Lightness
  | Nodes.Brick
  | Nodes.InputNumber
  | Nodes.InputTexture
  | Nodes.InputCurve
  | Nodes.InputColor
  | Nodes.Circle
  | Nodes.Noise
  | Nodes.Distance
  | Nodes.Divide
  | Nodes.Subtract
  | Nodes.Pow
  | Nodes.Multiply
  | Nodes.Blend
  | Nodes.Blur
  | Nodes.Invert
  | Nodes.NormalMap
  | Nodes.Gradient
  | Nodes.Transform
  | Nodes.OutputNumber
  | Nodes.OutputCurve
  | Nodes.OutputTexture
  | Nodes.OutputColor
  | Nodes.ModuleNode

export type ConnProps = Connection<Node, Node>
