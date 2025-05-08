import type { Command } from "../../../components/commands/Command";
import { StackNode } from "./StackNode";

export class Stack {
  public stack: StackNode[];

  constructor() {
    this.stack = [];
  }

  push(command: Command) {
    return this.stack.push(new StackNode(command));
  }

  pop() {
    return this.stack.pop();
  }

  clear() {
    this.stack = [];
    return this;
  }
}
