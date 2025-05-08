<script setup lang="ts">
import { nextTick, ref } from "vue";
import { Panel, VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import Icon from "../../shared/ui/Icon.vue";

import { useLayout } from "./useLayout";
import { initialEdges, initialNodes } from "./initial-elements";

const nodes = ref(initialNodes);
const edges = ref(initialEdges);

const { layout } = useLayout();
const { fitView } = useVueFlow("mock");

async function layoutGraph(direction: "LR" | "TB") {
  nodes.value = layout(nodes.value, edges.value, direction);

  nextTick(() => {
    fitView();
  });
}
</script>

<template>
  <div class="h-full layout-flow flex-auto">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      @nodes-initialized="layoutGraph('LR')"
    >
      <Background />

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
