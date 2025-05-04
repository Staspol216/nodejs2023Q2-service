<script setup lang="ts">
import "@electric-sql/pglite-repl/webcomponent";
import { nextTick, ref, inject, onMounted } from "vue";
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
import type { Edge as VueFlowEdge, Node as VueFlowNode } from "@vue-flow/core";
import type { Workflow } from "../../models/Workflow";
import { Node } from "../../models/Node";
import { setupGraph } from "./WorkflowToGraph";

const db = inject<DB>("db")!;

const route = useRoute();

const workflow = ref<Workflow>();
const nodes = ref<VueFlowNode[]>([]);
const edges = ref<VueFlowEdge[]>([]);

const { layout } = useLayout();
const {
  fitView,
  addNodes,
  addEdges,
  updateEdge,
  onNodesChange,
  onEdgesChange,
  onEdgeUpdate,
  onConnect,
  onNodesInitialized,
} = useVueFlow("workflow");

onNodesChange(async (changes) => {
  for (const change of changes) {
    if (change.type === "remove") {
      workflow.value?.removeNodeById(change.id);
      await workflowApi.updateWorkflowById(workflow.value!);
    }
  }
});

onEdgesChange(async (changes) => {
  for (const change of changes) {
    if (change.type === "remove") {
      const sourceNode = workflow.value?.getNodeById(change.source);
      sourceNode?.removeNext(change.target);
      await workflowApi.updateWorkflowById(workflow.value!);
    }
  }
});

onEdgeUpdate(async ({ edge, connection }) => {
  const isTargetUpdated = edge.target !== connection.target;
  const isSourceUpdated = edge.source !== connection.source;

  if (isSourceUpdated) {
    const oldSourceNode = workflow.value?.getNodeById(edge.source);
    oldSourceNode?.removeNext(edge.target);
    const newSourceNode = workflow.value?.getNodeById(connection.source);
    newSourceNode?.addNext(edge.target);
  }

  if (isTargetUpdated) {
    const sourceNode = workflow.value?.getNodeById(edge.source);
    sourceNode?.removeNext(edge.target);
    sourceNode?.addNext(connection.target);
  }

  updateEdge(edge, connection);
  await workflowApi.updateWorkflowById(workflow.value!);
});

onConnect(async (params) => {
  console.log(params);
  const sourceNode = workflow.value?.getNodeById(params.source);
  sourceNode?.addNext(params.target);

  addEdges(params);
  await workflowApi.updateWorkflowById(workflow.value!);
});

onNodesInitialized(() => {
  layoutGraph("LR");
});

const getWorkflowById = async () => {
  const workflowModel = await workflowApi.getWorkflowById(
    String(route.params.id)
  );
  workflow.value = workflowModel;
  const { nodes: graphNodes, edges: graphEdges } = setupGraph(workflowModel);
  nodes.value = graphNodes;
  edges.value = graphEdges;
};

onMounted(() => {
  getWorkflowById();
});

const layoutGraph = (direction: "LR" | "TB") => {
  nodes.value = layout(nodes.value, edges.value, direction);

  nextTick(() => {
    fitView();
  });
};

const handleAddNode = async () => {
  const node = new Node({ name: `Node ${workflow.value?.nodes.length! + 1}` });
  workflow.value?.addNode(node);
  await workflowApi.updateWorkflowById(workflow.value!);
  const newGraphNode = {
    id: node.id,
    data: {
      label: node.name,
    },
    position: { x: 0, y: 0 },
  };
  addNodes(newGraphNode);
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
        <VueFlow v-model:nodes="nodes" v-model:edges="edges" fit-view-on-init>
          <Background />

          <Panel class="process-panel" position="top-left">
            <div class="layout-panel">
              <button title="set horizontal layout" @click="handleAddNode">
                <Icon name="add" />
              </button>
            </div>
          </Panel>
          <Panel class="process-panel" position="top-right">
            <div class="layout-panel">
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
