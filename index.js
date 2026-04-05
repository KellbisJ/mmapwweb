import { NodeCreator, NodeHandler } from "./lib/main.js";

const dropeableZone = document.getElementById("dropeableZone");

const node = new NodeCreator().createNode("CoreNode", { x: "50%", y: "10%" });

const nodeHandler = new NodeHandler();
nodeHandler.appendNodeToDragZoneContainer(dropeableZone, node);
nodeHandler.dragNode(node, dropeableZone);
