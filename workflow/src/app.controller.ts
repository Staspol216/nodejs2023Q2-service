import {
  Body,
  Controller,
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
    console.log(111);
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
}
