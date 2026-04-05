import { nodeCreator, nodeHandler } from "./lib/main.js";
import { addCoreNodesToNodesContainer } from "./lib/add-node.js";

const nodesContainer = document.getElementById("dropeableZone");
const btnAddNode = document.getElementById("addNode");

const node = nodeCreator.createNode("CoreNode", { x: "50%", y: "10%" });
const btnMenuNode = node.querySelector(".btn-node");

nodeHandler.appendNodeToDragZoneContainer(nodesContainer, node);
nodeHandler.dragNode(node, nodesContainer);
nodeHandler.showNodeMethodsMenu(node, nodeCreator, nodesContainer, btnMenuNode);

btnAddNode.addEventListener("click", addCoreNodesToNodesContainer);
