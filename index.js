import { dragNode } from "./lib/drag-node.js";
import { addCoreNodeToContainer } from "./lib/add-core-node-container.js";
import { addNodeOptions } from "./lib/add-node-options.js";

const dropeableZone = document.getElementById("dropeableZone");
const addNodeBtn = document.getElementById("addNode");
const initialNode = document.getElementById("initialNode");
const btnInitialNode = initialNode.querySelector(".btn-node");
// console.log(btnInitialNode);
// console.log(btnInitialNode instanceof HTMLElement);

// const nodes = document.querySelectorAll(".node");

addCoreNodeToContainer(dropeableZone, addNodeBtn);
dragNode(initialNode, dropeableZone);
addNodeOptions(btnInitialNode, initialNode);

// dragNodesInitializer(dropeableZone, nodes); // test
