import { Node } from "./Node";

export class Workflow {
  public id: string;
  public name: string;
  public nodes: Node[];
  constructor(data: Workflow) {
    this.id = data.id;
    this.name = data.name;
    this.nodes = data.nodes.map((node) => new Node(node));
  }
}
