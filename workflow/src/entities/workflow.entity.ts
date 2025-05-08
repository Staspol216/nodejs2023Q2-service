import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Node } from './node.entity';

@Entity('workflow')
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @OneToMany(() => Node, (node) => node.workflow, {
    cascade: true,
    eager: true,
  })
  nodes: Relation<Node[]>;

  constructor(partial: Partial<Workflow>) {
    Object.assign(this, partial);
  }
}
