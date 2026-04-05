import { nodeMenu } from "./node-menu.js";

function showNodeMethodsMenu(node, btnNode) {
  if ((!node) instanceof HTMLElement || (!btnNode) instanceof HTMLElement) {
    console.error(`INCORRECT DATA - HTMLElement? -> ${node}`);
    return;
  }

  let isActive = false;
  let nodeMethodsContainer;

  btnNode.addEventListener("click", (e) => {
    e.preventDefault();

    if (nodeMethodsContainer) {
      nodeMethodsContainer.remove();
      nodeMethodsContainer = null;
    } else {
      nodeMethodsContainer = nodeMenu(node);
      node.appendChild(nodeMethodsContainer);
    }

    isActive = !isActive;
    // console.log(isActive);
  });
}

export { showNodeMethodsMenu };
