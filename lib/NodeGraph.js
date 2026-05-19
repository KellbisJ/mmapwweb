import { CanvasBackground } from "./CanvasBrackground.js";
import { NodeHandler } from "./NodeHandler.js";
import { CanvasBranchDrawer } from "./CanvasBranchDrawer.js";
import { DragHandler } from "./DragHandler.js";
import DOMPurify from "dompurify";

export class NodeGraph {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

    if (!this.container) throw new Error(`Container #${containerId} not found`);

    this.backgroundHandler = new CanvasBackground(this.container);
    this.store = new NodeHandler();
    this.branchDrawer = new CanvasBranchDrawer(this.container, this.store);
    this.dragHandler = new DragHandler(this.container, () => this.branchDrawer.redrawAll());

    this.backgroundHandler.initializer();
    this.resizeAndRedraw = () => {
      const containerRect = this.container.getBoundingClientRect();

      this.backgroundHandler.calculateGrid();
      this.branchDrawer.redrawAll();
    };

    screen.orientation.addEventListener("change", () => {
      const containerRect = this.container.getBoundingClientRect();

      for (const node of this.store.getAllNodes()) {
        if (!node.element) continue;

        const rect = node.element.getBoundingClientRect();
        console.log(rect);

        let left = 0;
        let top = 0;

        const availableWidth = Math.max(50, window.innerWidth - (containerRect.left + rect.width));
        const availableHeight = Math.min(window.innerHeight - containerRect.top * 2, this.container.offsetHeight);

        if (availableWidth > 640 && this.container.offsetWidth <= window.innerWidth / 2) {
          left = rect.left + rect.width / 2;

          top = Math.max(5, containerRect.top + availableHeight * 0.3);
        } else if (availableWidth < 640 && this.container.offsetWidth > window.innerWidth) {
          left = rect.left - rect.width / 2;

          top = Math.max(5, containerRect.top + availableHeight * 0.3);
        } else {
          const centerX = (containerRect.right - containerRect.left) / 2;
          left = Math.max(containerRect.left + 10, rect.left + rect.width / 2 - availableWidth * 0.5);

          top = Math.min(rect.top + rect.height * 0.8, window.innerHeight - 100);
        }

        left = Math.max(containerRect.left + 10, Math.min(left, containerRect.right - rect.width));

        top = Math.max(containerRect.top + 5, Math.min(top, this.container.offsetHeight - rect.height));

        node.element.style.left = `${left}px`;
        node.element.style.top = `${top}px`;
      }

      this.branchDrawer.redrawAll();

      // const type = event.target.type;
      // const angle = event.target.angle;
      // console.log(`ScreenOrientation change: ${type}, ${angle} degrees.`);
    });
    window.addEventListener("resize", this.resizeAndRedraw);
  }

  createNode(title = "Node", parentId = null, initialPos = null) {
    const id = this.store.nextId++;
    const nodeDiv = document.createElement("div");
    nodeDiv.className = "node";

    let left, top;
    let color = "#B026FF";

    if (initialPos) {
      left = initialPos.x;
      top = initialPos.y;
    } else if (parentId !== null && this.store.getNode(parentId)) {
      const parentEl = this.store.getNode(parentId).element;
      const parentRect = parentEl.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();

      left = parentRect.left + parentRect.width / 2 - 70 - containerRect.left;
      top = parentRect.top + parentRect.height + 20 - containerRect.top;
    } else {
      const rect = this.container.getBoundingClientRect();
      left = rect.width / 2 - 90;
      top = 300;
    }

    if (title === "Child") color = "#35A29F";

    nodeDiv.style.left = `${left}px`;
    nodeDiv.style.top = `${top}px`;
    nodeDiv.style.backgroundColor = color;

    const span = document.createElement("span");
    span.className = "contenteditable-text";
    span.contentEditable = "true";
    span.textContent = DOMPurify.sanitize(title);

    const nodeHeader = document.createElement("div");
    nodeHeader.className = "node_header";
    nodeHeader.appendChild(span);

    const nodeMenu = document.createElement("div");
    nodeMenu.className = "node_menu";

    const addChildBtn = document.createElement("button");
    addChildBtn.className = "add_child_btn";
    addChildBtn.textContent = "+";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete_node_btn";
    deleteBtn.textContent = "x";

    nodeMenu.append(addChildBtn, deleteBtn);
    nodeHeader.append(span, nodeMenu);
    nodeDiv.appendChild(nodeHeader);

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

  headerDraggable() {
    const layoutHeader = document.querySelector(".mindmap_core .header");

    if (layoutHeader) {
      // layoutHeader.style.left = "12px";
      // layoutHeader.style.top = "12px";

      this.dragHandler.makeDraggable(layoutHeader);
    }
  }
}
