import type { Workflow } from "../../models/Workflow";
import {
  MarkerType,
  type Edge as VueFlowEdge,
  type Node as VueFlowNode,
} from "@vue-flow/core";
import { v4 as uuidv4 } from "uuid";

export const setupGraph = (workflowModel: Workflow) => {
  const nodes = workflowModel.nodes.map<VueFlowNode>((workflowNode) => {
    return {
      id: workflowNode.id,
      data: {
        label: workflowNode.name,
      },
      position: { x: 0, y: 0 },
    };
  });

  const edges = workflowModel.nodes.reduce<VueFlowEdge[]>(
    (acc, workflowNode) => {
      const edges = workflowNode.nexts.reduce<VueFlowEdge[]>((acc, nextId) => {
        acc.push({
          id: uuidv4(),
          source: workflowNode.id,
          target: nextId,
          markerEnd: MarkerType.ArrowClosed,
          updatable: true,
        });
        return acc;
      }, []);
      acc.push(...edges);
      return acc;
    },
    []
  );

  return { nodes, edges };
};
