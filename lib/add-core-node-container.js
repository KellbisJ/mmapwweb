import { dragNode } from "./drag-node.js";
import { showNodeMethodsMenu } from "./show-node-methods-menu.js";

function addCoreNodeToContainer(container, addCoreNodeBtn) {
  if (!(container instanceof HTMLElement)) {
    console.error(`Expecting HTMLElement Container for addNode fn - HTMLElement? -> ${container}`);
    return;
  }
  addCoreNodeBtn.addEventListener("click", () => {
    addCoreNode(container);
  });

  function addCoreNode(container) {
    if (container.classList.contains("mindmap_nodes")) {
      const mMapNode = document.createElement("div");
      mMapNode.classList.add("node", "core_node");

      const btnNode = document.createElement("button");
      btnNode.textContent = "...";
      btnNode.classList.add("btn-node");

      mMapNode.textContent = "Node";

      mMapNode.appendChild(btnNode);

      container.appendChild(mMapNode);

      dragNode(mMapNode, container);
      addNodeOptions(btnNode, mMapNode);
    }
  }
}

export { addCoreNodeToContainer };
