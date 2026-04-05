import { dragNode } from "./drag-node.js";
import { showNodeMethodsMenu } from "./show-node-methods-menu.js";

function nodeMenu() {
  const nodeMethods = [
    { name: "Add Image", fn: addImage },

    { name: "Remove Node", fn: removeNode },
  ];

  const nodeOptionsContainer = document.createElement("div");
  nodeOptionsContainer.style.position = "absolute";

  nodeMethods.forEach((method) => {
    const nodeMethodBtn = document.createElement("button");
    nodeMethodBtn.textContent = method.name;

    nodeMethodBtn.addEventListener("click", (e) => {
      e.preventDefault();
      method.fn(e, node);
    });

    nodeOptionsContainer.appendChild(nodeMethodBtn);
  });

  return nodeOptionsContainer;
}

// function addChildNode(e, parentNode) {
//   const dropeableZone = document.getElementById("dropeableZone");

//   const parentNodeRect = parentNode.getBoundingClientRect();

//   const newNodeSpawn = {
//     top: parentNodeRect.top - 40,
//     left: parentNodeRect.left - 10,
//   }; // basic spawner

//   const newChildNode = document.createElement("div");
//   newChildNode.classList.add("node");
//   newChildNode.style.top = newNodeSpawn.top + "px";
//   newChildNode.style.left = newNodeSpawn.left + "px";
//   newChildNode.textContent = "Child Node";

//   const btnNode = document.createElement("button");
//   btnNode.textContent = "...";
//   btnNode.classList.add("btn-node");

//   newChildNode.appendChild(btnNode);

//   addNodeOptions(btnNode, newChildNode); // menu functionality
//   dragNode(newChildNode, dropeableZone, parentNode); // drag functionality

//   dropeableZone.appendChild(newChildNode);
// }

// function addImage(e, parentNode) {
//   const img = document.createElement("img");
//   img.src = "";
// }

// function removeNode(e, parentNode) {
//   const node = e.target.closest(".node");
//   node.remove();
// }

export { nodeMenu };
