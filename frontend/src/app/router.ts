import { createRouter, createWebHistory } from "vue-router";

import WorkflowsList from "../components/Workflow/WorkflowsList.vue";
import Workflow from "../components/Workflow/Workflow.vue";

const routes = [
  { path: "/", redirect: "/workflows" },
  { name: "workflow-list", path: "/workflows", component: WorkflowsList },
  { name: "workflow", path: "/workflow/:id", component: Workflow },
  { path: "/:pathMatch(.*)*", redirect: "workflows" },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
