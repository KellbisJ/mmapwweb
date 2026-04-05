import { nodeCreator, nodeHandler } from "./main.js";

const nodesContainer = document.getElementById("dropeableZone");

const addCoreNodesToNodesContainer = () => {
  console.log("adding node?");

  const newNode = nodeCreator.createNode("CoreNode", { x: "30%", y: "10%" });
  const btnMenuNewNode = newNode.querySelector(".btn-node");

  nodeHandler.addNewNode(newNode, nodesContainer);

  nodeHandler.showNodeMethodsMenu(newNode, nodeCreator, nodesContainer, btnMenuNewNode);
};

export { addCoreNodesToNodesContainer };
