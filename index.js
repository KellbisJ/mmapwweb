import { NodeGraph } from "./lib/NodeGraph.js";
import { HeaderManager } from "./lib/Header.js";

const container = document.getElementById("dragZone");

document.addEventListener("DOMContentLoaded", () => {
  const graph = new NodeGraph(container);

  graph.createNode("Main Idea");

  const headerManager = new HeaderManager({
    nodeGraph: graph,
    backgroundHandler: graph.backgroundHandler,
  });
});
