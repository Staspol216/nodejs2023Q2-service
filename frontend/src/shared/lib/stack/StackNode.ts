import type { Command } from "../../../components/commands/Command";

export class StackNode {
  public action: Command;

  constructor(action: Command) {
    this.action = action;
  }

  getAction() {
    return this.action;
  }
}
