import { CanvasBackground } from "./CanvasBackground.js";
import { NodeHandler } from "./NodeHandler.js";
import { CanvasBranchDrawer } from "./CanvasBranchDrawer.js";
import { DragHandler } from "./DragHandler.js";
import { ImageManager } from "./ImageManager.js";
import DOMPurify from "dompurify";
import feather from "feather-icons";

const NODE_COLORS = [
  "#16181d", // Dark (default)
  "#3B82E5", // Blue
  "#35A29F", // Green
  "#F9C13A", // Yellow
  "#F97A3A", // Orange
  "#8B5E9F", // Purple
];

export class NodeGraph {
  constructor(container) {
    this.container = container;

    if (!this.container) throw new Error(`Invalid Container ${container}`);

    this.nodeColorIndex = {};

    this.backgroundHandler = new CanvasBackground(this.container);
    this.store = new NodeHandler();
    this.branchDrawer = new CanvasBranchDrawer(this.container, this.store);
    this.dragHandler = new DragHandler(this.container, () => this.branchDrawer.redrawAll());

    requestAnimationFrame(() => {
      if (this.backgroundHandler.activeBackground) {
        this.backgroundHandler.updateCanvasState();
      }
    });

    this.resizeAndRedraw = () => {
      const containerRect = this.container.getBoundingClientRect();
      this.branchDrawer.redrawAll();
    };

    screen.orientation.addEventListener("change", () => {
      const containerRect = this.container.getBoundingClientRect();

      for (const node of this.store.getAllNodes()) {
        if (!node.element) continue;

        const rect = node.element.getBoundingClientRect();

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
    });
    window.addEventListener("resize", this.resizeAndRedraw);

    this.container.addEventListener("click", (e) => {
      if (!e.target.closest(".node")) {
        this.deselectAllNodes();
      }
    });
  }

  deselectAllNodes() {
    for (const node of this.store.getAllNodes()) {
      if (node.element) {
        node.element.classList.remove("selected");
      }
    }
  }

  selectNode(nodeId) {
    this.deselectAllNodes();
    const node = this.store.getNode(nodeId);
    if (node && node.element) {
      node.element.classList.add("selected");
    }
  }

  createNode(title = "Node", parentId = null, initialPos = null) {
    const id = this.store.nextId++;
    this.nodeColorIndex[id] = 0;
    const nodeDiv = document.createElement("div");
    nodeDiv.className = "node";

    let left, top;
    let color = NODE_COLORS[0];

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

    nodeDiv.style.left = `${left}px`;
    nodeDiv.style.top = `${top}px`;
    nodeDiv.style.backgroundColor = color;

    const nodeText = document.createElement("div");
    nodeText.className = "contenteditable_text";
    nodeText.contentEditable = "true";
    nodeText.textContent = DOMPurify.sanitize(title);

    const nodeHeader = document.createElement("div");
    nodeHeader.className = "node_header";
    nodeHeader.appendChild(nodeText);

    const nodeMenu = document.createElement("div");
    nodeMenu.className = "node_menu";

    // Create D-Pad menu container
    const dpadContainer = document.createElement("div");
    dpadContainer.className = "dpad_menu_container";

    // D-Pad button configuration (Up, Down, Left, Right)
    const buttonPositions = [
      { className: "dpad_up dpad_button--add", icon: "plus", text: "Add" },
      { className: "dpad_down dpad_button--color", icon: "code", text: "Color" },
      { className: "dpad_left dpad_button--delete", icon: "x", text: "Delete" },
      { className: "dpad_right dpad_button--image", icon: "image", text: "Img" },
    ];

    buttonPositions.forEach((config, index) => {
      const button = this.createDpadButton(config.icon, config.text, config.className);

      if (config.className.includes("add")) {
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          this.addChildNode(id);
          this.deselectAllNodes();
        });
      } else if (config.className.includes("color")) {
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          const node = this.store.getNode(id);
          if (node && node.element) {
            let index = this.nodeColorIndex[id] || 0;
            index = (index + 1) % NODE_COLORS.length;
            this.nodeColorIndex[id] = index;
            node.element.style.backgroundColor = NODE_COLORS[index];
          }
        });
      } else if (config.className.includes("delete")) {
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          this.deleteNode(id);
          this.deselectAllNodes();
        });
      } else if (config.className.includes("image")) {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.style.display = "none";
        button.appendChild(fileInput);

        button.addEventListener("click", (e) => {
          e.stopPropagation();
          fileInput.click();
        });

        fileInput.addEventListener("change", async (e) => {
          try {
            if (!e.target.files || e.target.files.length === 0) return;
            await ImageManager.addImageToNode(nodeDiv, e.target.files[0]);
            this.deselectAllNodes();
          } catch (error) {
            console.error(error.message);
          }
        });
      }

      dpadContainer.appendChild(button);
    });

    const centerPlaceholder = document.createElement("div");
    centerPlaceholder.className = "dpad_center";
    dpadContainer.appendChild(centerPlaceholder);

    nodeMenu.appendChild(dpadContainer);
    nodeHeader.appendChild(nodeText);
    nodeHeader.appendChild(nodeMenu);
    nodeDiv.appendChild(nodeHeader);

    this.container.appendChild(nodeDiv);
    this.store.addNode(id, nodeDiv, parentId);
    this.dragHandler.makeDraggable(nodeDiv);

    // Toggle selection on click

    nodeText.addEventListener("click", (e) => {
      e.stopPropagation();
      this.selectNode(id);
    });

    nodeDiv.addEventListener("click", (e) => {
      if (e.target.closest(".node_menu")) return;
      e.stopPropagation();
      this.selectNode(id);
    });

    this.branchDrawer.redrawAll();
    return id;
  }

  createDpadButton(iconName, text, className) {
    const button = document.createElement("button");
    button.className = `dpad_button ${className}`;

    const icon = document.createElement("i");
    icon.classList.add("feather-icon");
    icon.innerHTML = feather.icons[iconName].toSvg();

    const label = document.createElement("span");
    label.textContent = text;

    button.appendChild(icon);
    button.appendChild(label);

    return button;
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

  addImageToNode(nodeId, file) {
    try {
      const nodeToInsertImage = this.store.getNode(nodeId).element;

      if (!nodeToInsertImage) throw new Error("Parent node not found");

      ImageManager.addImageToNode(nodeToInsertImage, file);

      this.branchDrawer.redrawAll();
    } catch (error) {
      console.error(error.message);
    }
  }

  clearAllNodes() {
    for (const node of this.store.getAllNodes()) {
      node.element.remove();
    }
    this.store.clear();
    this.branchDrawer.redrawAll();
  }
}
