import { ClassicPreset } from 'rete'
import { Node } from '../types';

export class Connection<A extends Node, B extends Node> extends ClassicPreset.Connection<A, B> { }
