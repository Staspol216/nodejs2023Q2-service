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

  addNode(node: Node) {
    this.nodes.push(node);
    return this;
  }

  getNodeById(id: string) {
    return this.nodes.find((node) => node.id === id)!;
  }

  removeNodeById(id: string) {
    const removeIndex = this.nodes.findIndex((node) => node.id === id);
    this.nodes.splice(removeIndex, 1);
  }
}
