import { NodeGraph } from "./lib/NodeGraph.js";

document.addEventListener("DOMContentLoaded", () => {
  const graph = new NodeGraph("dragZone");

  graph.headerDraggable();
  graph.createNode("Main Idea");

  const addBtn = document.getElementById("addNode");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      graph.createNode("Node");
    });
  }
});
