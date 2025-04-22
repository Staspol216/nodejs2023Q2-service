export class Node {
  public id: string;
  public name: string;
  public nexts: string[];
  constructor(data: Node) {
    this.id = data.id;
    this.name = data.name;
    this.nexts = data.nexts;
  }
}
