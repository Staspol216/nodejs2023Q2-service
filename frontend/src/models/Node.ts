import { v4 as uuidv4 } from "uuid";

export class Node {
  public id: string;
  public name: string;
  public nexts: string[];
  constructor(data: Partial<Node>) {
    const uuid = uuidv4();

    this.id = data.id ?? uuid;
    this.name = data.name ?? uuid;
    this.nexts = data.nexts ?? [];
  }

  addNext(id: string) {
    if (this.nexts.includes(id)) return;
    this.nexts.push(id);
  }

  removeNext(id: string) {
    this.nexts = this.nexts.filter((nextId) => id !== nextId);
  }
}
