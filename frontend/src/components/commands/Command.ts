export interface Command {
  backup: any;
  entity: unknown;
  payload: unknown;
  execute(): boolean;
  restore(): boolean;
}
