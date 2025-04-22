<script setup lang="ts">
import "@electric-sql/pglite-repl/webcomponent";
import { nextTick, ref, inject } from "vue";
import { Panel, VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import Icon from "../../shared/ui/Icon.vue";

import Graph from "../../components/Graph/Graph.vue";
import Tabs from "../../shared/ui/tabs/Tabs.vue";
import TabsList from "../../shared/ui/tabs/TabsList.vue";
import TabsTrigger from "../../shared/ui/tabs/TabsTrigger.vue";
import TabsContent from "../../shared/ui/tabs/TabsContent.vue";

import { useLayout } from "../Graph/useLayout";

import type { DB } from "../../app/db";
import workflowApi from "../../services/workflow";
import { useRoute } from "vue-router";
import type { Node as GraphNode } from "@vue-flow/core";
import type { Workflow } from "../../models/Workflow";
import { Node } from "../../models/Node";
import { v4 as uuidv4 } from "uuid";

const db = inject<DB>("db")!;

const route = useRoute();

const workflow = ref<Workflow>();
const nodes = ref<GraphNode[]>([]);
const edges = ref([]);

const { layout } = useLayout();
const { fitView } = useVueFlow();

const getWorkflowById = async () => {
  const workflowModel = await workflowApi.getWorkflowById(
    String(route.params.id)
  );
  workflow.value = workflowModel;
  setupGraph(workflowModel);
};
getWorkflowById();

const setupGraph = (workflowModel: Workflow) => {
  nodes.value = workflowModel.nodes.map((workflowNode) => {
    return {
      id: workflowNode.id,
      data: {
        label: workflowNode.name,
      },
      position: { x: 0, y: 0 },
    };
  });
};

const layoutGraph = (direction: "LR" | "TB") => {
  nodes.value = layout(nodes.value, edges.value, direction);

  nextTick(() => {
    fitView();
  });
};

const handleAddNode = async () => {
  const node = new Node({ id: uuidv4(), name: "Bob", nexts: [] });
  workflow.value?.addNode(node);
  const workflowModel = await workflowApi.updateWorkflowById(workflow.value!);
  setupGraph(workflowModel);
};
</script>

<template>
  <Tabs class="h-full tabs" default-value="workflow">
    <TabsList>
      <TabsTrigger value="workflow">Workflow</TabsTrigger>
      <TabsTrigger value="mock-workflow">Mock-Workflow</TabsTrigger>
      <TabsTrigger value="repl">REPL</TabsTrigger>
    </TabsList>
    <TabsContent class="tab-content" value="workflow">
      <div class="h-full layout-flow flex-auto">
        <VueFlow
          :nodes="nodes"
          :edges="edges"
          @nodes-initialized="layoutGraph('LR')"
        >
          <Background />

          <Panel class="process-panel" position="top-right">
            <div class="layout-panel">
              <button title="set horizontal layout" @click="handleAddNode">
                <Icon name="add" />
              </button>

              <button title="set horizontal layout" @click="layoutGraph('LR')">
                <Icon name="horizontal" />
              </button>

              <button title="set vertical layout" @click="layoutGraph('TB')">
                <Icon name="vertical" />
              </button>
            </div>
          </Panel>
        </VueFlow>
      </div>
    </TabsContent>
    <TabsContent class="tab-content" value="mock-workflow">
      <Graph />
    </TabsContent>
    <TabsContent class="tab-content" value="repl">
      <pglite-repl class="h-full" :pg="db" />
    </TabsContent>
  </Tabs>
  <div class="layout-flow"></div>
</template>

<style scoped>
.layout-flow {
  background-color: #1a192b;
  flex: 1 1 auto;
}

.process-panel,
.layout-panel {
  display: flex;
  gap: 10px;
}

.process-panel {
  background-color: #2d3748;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.process-panel button {
  border: none;
  cursor: pointer;
  background-color: #4a5568;
  border-radius: 8px;
  color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.process-panel button {
  font-size: 16px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
