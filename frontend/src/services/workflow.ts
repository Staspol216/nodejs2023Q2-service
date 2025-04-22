import type { AxiosInstance } from "axios";
import { instance } from "../shared/api";
import { Workflow } from "../models/Workflow";

export class WorkflowApi {
  constructor(public instance: AxiosInstance) {}

  async getWorkflows() {
    return await instance.get("workflow");
  }

  async getWorkflowById(id: string) {
    const response = await this.instance.get(`workflow/${id}`);
    return new Workflow(response.data);
  }

  async updateWorkflowById(workflow: Workflow) {
    const response = await this.instance.put(`workflow/${workflow.id}`, {
      workflow,
    });
    console.log(response.data);
    return response.data;
  }
}

export default new WorkflowApi(instance);
