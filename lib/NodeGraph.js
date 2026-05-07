import { CanvasHandler } from "./CanvasHandler.js";
import { NodeHandler } from "./NodeHandler.js";
import { BranchDrawer } from "./BranchDrawer.js";
import { DragHandler } from "./DragHandler.js";

export class NodeGraph {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) throw new Error(`Container #${containerId} not found`);

    this.canvasHandler = new CanvasHandler(this.container);
    this.store = new NodeHandler();
    this.branchDrawer = new BranchDrawer(this.canvasHandler, this.store);
    this.dragHandler = new DragHandler(this.container, () => this.branchDrawer.redrawAll());

    this.resizeAndRedraw = () => this.branchDrawer.redrawAll();
    window.addEventListener("resize", this.resizeAndRedraw);
  }

  createNode(title = "Node", parentId = null, initialPos = null) {
    const id = this.store.nextId++;
    const nodeDiv = document.createElement("div");
    nodeDiv.className = "node";

    let left = 100,
      top = 100;
    if (initialPos) {
      left = initialPos.x;
      top = initialPos.y;
    } else if (parentId !== null && this.store.getNode(parentId)) {
      const parentEl = this.store.getNode(parentId).element;
      const parentRect = parentEl.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();
      left = parentRect.left + parentRect.width / 2 - 70 - containerRect.left;
      top = parentRect.top + parentRect.height + 20 - containerRect.top;
      const maxLeft = containerRect.width - 150;
      const maxTop = containerRect.height - 100;
      left = Math.min(Math.max(left, 10), maxLeft);
      top = Math.min(Math.max(top, 10), maxTop);
    } else {
      const rect = this.container.getBoundingClientRect();
      left = Math.random() * (rect.width - 160);
      top = Math.random() * (rect.height - 120);
    }

    nodeDiv.style.left = `${left}px`;
    nodeDiv.style.top = `${top}px`;
    nodeDiv.innerHTML = `
      <div class="node-header">
        <span>${title}</span>
        <div>
          <button class="add_child_btn" data-node-id="${id}" title="Add child">+</button>
          <button class="delete_node_btn" data-node-id="${id}" title="Delete node">✖</button>
        </div>
      </div>
    `;

    this.container.appendChild(nodeDiv);
    this.store.addNode(id, nodeDiv, parentId);
    this.dragHandler.makeDraggable(nodeDiv);

    const childBtn = nodeDiv.querySelector(".add_child_btn");
    childBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.addChildNode(id);
    });

    const delBtn = nodeDiv.querySelector(".delete_node_btn");
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.deleteNode(id);
    });

    this.branchDrawer.redrawAll();
    return id;
  }

  deleteNode(id) {
    const deletedNodes = this.store.deleteNode(id);
    for (const node of deletedNodes) {
      if (node.element) node.element.remove();
    }
    this.branchDrawer.redrawAll();
  }

  addChildNode(parentId) {
    const parentNode = this.store.getNode(parentId);
    if (!parentNode) return;
    const parentRect = parentNode.element.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    const childX = parentRect.left + parentRect.width / 2 - 70 - containerRect.left;
    const childY = parentRect.top + parentRect.height + 20 - containerRect.top;
    this.createNode("Child", parentId, { x: childX, y: childY });
  }

  clearAllNodes() {
    for (const node of this.store.getAllNodes()) {
      node.element.remove();
    }
    this.store.clear();
    this.branchDrawer.redrawAll();
  }
}
