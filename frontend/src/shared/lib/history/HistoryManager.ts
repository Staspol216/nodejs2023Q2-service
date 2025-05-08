import type { Command } from "../../../components/commands/Command";
import { Stack } from "../stack/Stack";

export class HistoryManager {
  public past: Stack;
  public future: Stack;

  constructor() {
    this.past = new Stack();
    this.future = new Stack();
  }

  record(command: Command) {
    command.execute();
    this.past.push(command);
    return this;
  }

  undo() {
    const node = this.past.pop();
    if (node) {
      const action = node.getAction();
      const isRestored = action.restore();
      if (isRestored) {
        this.future.push(action);
        return true;
      }
    }
    return false;
  }

  redo() {
    const node = this.future.pop();
    if (node) {
      const action = node.getAction();
      const isExecuted = action.execute();
      if (isExecuted) {
        this.past.push(action);
        return true;
      }
    }
    return false;
  }
}
