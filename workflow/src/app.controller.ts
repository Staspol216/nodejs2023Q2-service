import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Workflow } from './entities/workflow.entity';

@Controller('workflow')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getWorkflows(): Promise<Workflow[]> {
    const workflows = await this.appService.getWorkflows();
    return workflows;
  }

  @Get(':uuid')
  async findWorkflow(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<Workflow> {
    const workflow = await this.appService.findWorkflow(uuid);
    return workflow;
  }

  @Put(':uuid')
  async updateWorkflow(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() workflow: Workflow,
  ) {
    return await this.appService.updateWorkflow(workflow, uuid);
  }

  @Delete(':uuid')
  async delete(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return await this.appService.deleteWorkflow(uuid);
  }
}
