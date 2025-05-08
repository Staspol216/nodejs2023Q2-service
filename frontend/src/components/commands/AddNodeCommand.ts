import { type Command } from "./Command";

export class AddGraphNodeCommand implements Command {
  public backup: unknown | null;
  public entity: unknown;
  public payload: unknown;

  constructor(entity = {}, payload = {}) {
    this.entity = entity;
    this.payload = payload;
    this.backup = null;
  }

  execute() {
    console.log(this.backup);
    console.log(this.entity);
    console.log(this.payload);
    return true;
  }

  restore() {
    return true;
  }
}
