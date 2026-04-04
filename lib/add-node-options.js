import { nodeMenu } from "./node-menu.js";

function addNodeOptions(btnNode, node) {
  if ((!btnNode) instanceof HTMLElement || (!node) instanceof HTMLElement) {
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

export { addNodeOptions };
