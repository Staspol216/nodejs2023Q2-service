import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workflow } from './workflow.entity';

@Entity('node')
export class Node {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column({ type: 'uuid', array: true })
  nexts: string[];

  @ManyToOne(() => Workflow, (workflow) => workflow.nodes)
  @JoinColumn({ name: 'workflowId' })
  workflow: Workflow;

  constructor(partial: Partial<Node>) {
    Object.assign(this, partial);
  }
}
