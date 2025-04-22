import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workflow } from './entities/workflow.entity';
import { Repository } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WorkflowUpdateDto extends Workflow {}

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Workflow)
    private workflowRepository: Repository<Workflow>,
  ) {}

  async getWorkflows() {
    return await this.workflowRepository.find({
      relations: {
        nodes: true,
      },
    });
  }

  async findWorkflow(id: string) {
    return await this.workflowRepository.findOne({
      where: { id },
    });
  }

  async updateWorkflow(dto: WorkflowUpdateDto, id: string) {
    const workflow = await this.workflowRepository.findOne({ where: { id } });
    if (!workflow) {
      throw new NotFoundException(`Workflow with id ${id} not found`);
    }

    const updatedWorkflow = await this.workflowRepository.save({
      ...dto,
    });

    console.log(updatedWorkflow);
    return new Workflow(updatedWorkflow);
  }
}
