class NodeCreator {
  /**
   * Creates the basic structure for a node.
   * @param {string} type - The type of node (e.g., "CoreNode", "ChildNode").
   * @param {object} coordinates - The position {x, y} to generate the node.
   * @returns {HTMLElement} The newly created node element.
   */
  createNode(type, coordinates) {
    const node = document.createElement("div");
    node.classList.add("node");
    node.style.left = coordinates.x;
    node.style.top = coordinates.y;

    if (type === "CoreNode") {
      node.textContent = "Node";
      node.classList.add("core_node");
    }
    if (type === "ChildNode") {
      node.textContent = "Child Node";
      node.classList.add("child_node");
    }

    const btnNode = document.createElement("button");
    btnNode.textContent = "...";
    btnNode.classList.add("btn-node");
    node.appendChild(btnNode);

    return node;
  }
}

class NodeHandler {
  /**
   * Creates new nodes (coreNodes) and iserts them into container (dragZone).
   * @param {HTMLElement} container - The parent container, normally dragZone, where all nodes are.
   * @param {HTMLElement} node - The node element to handle, add functionalities or manipulate.
   */

  appendNodeToDragZoneContainer(container, node) {
    container.appendChild(node);
  }

  /**
   *
   * @param {HTMLElement} node - The node element to handle, add functionalities or manipulate.
   * @param {HTMLElement} container - The parent container, normally dragZone, where all nodes are.
   * @param {HTMLElement} parentNode - Null if it's a core node, parent node of current node (functionality element).
   */

  dragNode(node, container, parentNode) {
    if (!(node instanceof HTMLElement) || !(container instanceof HTMLElement)) {
      console.error(`node must be a valid HTMLElement -> ${node}, container (dragZone) must be a valid HTMLElement -> ${container}`);
      return;
    }
    function dragStartPhase(e) {
      e.preventDefault();

      const target = node;

      const targetRect = target.getBoundingClientRect();
      const dragZoneRect = container.getBoundingClientRect();

      // console.log(targetRect);

      const startLeft = targetRect.left - dragZoneRect.left;
      const startTop = targetRect.top - dragZoneRect.top;

      const startX = e.clientX ?? e.touches[0].clientX;
      const startY = e.clientY ?? e.touches[0].clientY;

      const minLeft = 0;
      const maxLeft = dragZoneRect.width - targetRect.width;
      const minTop = 0;
      const maxTop = dragZoneRect.height - targetRect.height;

      function dragMovePhase(e) {
        e.preventDefault(); // fucking touch event

        const currentX = e.clientX ?? e.touches[0].clientX;
        const currentY = e.clientY ?? e.touches[0].clientY;

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;

        newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
        newTop = Math.max(minTop, Math.min(newTop, maxTop));

        target.style.left = newLeft + "px";
        target.style.top = newTop + "px";

        if (parentNode instanceof HTMLElement) {
          const dragZoneRect = container.getBoundingClientRect();

          const parentRect = parentNode.getBoundingClientRect();
          const parentLeft = parentRect.left - dragZoneRect.left;
          const parentTop = parentRect.top - dragZoneRect.top;

          const parentCenterX = parentLeft + parentRect.width / 2;
          const parentCenterY = parentTop + parentRect.height / 2;

          const endX = currentX - dragZoneRect.left;
          const endY = currentY - dragZoneRect.top;

          const mMapCanvas = document.getElementById("mMapCanvas");

          const ctx = mMapCanvas.getContext("2d");
          ctx.clearRect(0, 0, container.width, container.height);

          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(parentCenterX, parentCenterY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      }

      function dragEndPhase() {
        document.removeEventListener("mousemove", dragMovePhase);
        document.removeEventListener("touchmove", dragMovePhase);
        document.removeEventListener("mouseup", dragEndPhase);
        document.removeEventListener("touchend", dragEndPhase);
      }

      document.addEventListener("mousemove", dragMovePhase);
      document.addEventListener("touchmove", dragMovePhase, { passive: false });
      document.addEventListener("mouseup", dragEndPhase);
      document.addEventListener("touchend", dragEndPhase);
    }
    node.addEventListener("mousedown", dragStartPhase);
    node.addEventListener("touchstart", dragStartPhase, { passive: false });
  }
  /**
   *
   * @param {HTMLElement} node - The node element to handle, add functionalities or manipulate.
   * @param {NodeCreator} nodeCreator - Instance of NodeCreator to use for creating new nodes.
   * @param {HTMLElement} container - The parent container, normally dragZone, where all nodes are.
   * @param {HTMLElement} btnMenuNode - Button that each node has to show its menu.
   */

  showNodeMethodsMenu(node, nodeCreator, container, btnMenuNode) {
    if ((!node) instanceof HTMLElement || (!btnMenuNode) instanceof HTMLElement) {
      console.error(`INCORRECT DATA - HTMLElement? -> ${node}`);
      return;
    }

    let isActive = false;
    let nodeMethodsMenuContainer;

    btnMenuNode.addEventListener("click", (e) => {
      e.preventDefault();

      if (nodeMethodsMenuContainer) {
        nodeMethodsMenuContainer.remove();
        nodeMethodsMenuContainer = null;
      } else {
        nodeMethodsMenuContainer = this.nodeMenu(nodeCreator, container);
        node.appendChild(nodeMethodsMenuContainer);
      }

      isActive = !isActive;
      // console.log(isActive);
    });
  }

  /**
   *
   * @param {NodeCreator} nodeCreator - Instance of NodeCreator to use for creating new nodes.
   * @param {HTMLElement} container - The parent container, normally dragZone, where all nodes are.
   * @returns {HTMLElement} nodeMethodsMenuContainer, node menu (HTMLElement).
   */

  nodeMenu(nodeCreator, container) {
    // if ((!nodeMethodsMenuContainer) instanceof HTMLElement) {
    //   console.error(`node menu container (HTMLElement)? -> ${node}`);
    //   return;
    // }

    const nodeMethodsMenuContainer = document.createElement("div");
    nodeMethodsMenuContainer.style.position = "absolute";

    const nodeMethods = [
      { name: "Add Child Node", fn: this.addChildNode },
      { name: "Add Image", fn: this.addImage },

      { name: "Remove Node", fn: this.removeNode },
    ];

    nodeMethods.forEach((method) => {
      const nodeMethodBtn = document.createElement("button");
      nodeMethodBtn.textContent = method.name;

      nodeMethodBtn.addEventListener("click", (e) => {
        e.preventDefault();
        method.fn.apply(this, [e, nodeCreator, container]);
      });

      nodeMethodsMenuContainer.appendChild(nodeMethodBtn);
    });

    return nodeMethodsMenuContainer;
  }

  /**
   *
   * @param {HTMLElement} newNode - The new node element to create using nodeCreator (instace of NodeCreator).
   * @param {HTMLElement} container - The parent container, normally dragZone, where all nodes are.
   * @returns {HTMLElement} New node (HTMLElement).
   */

  addNewNode(newNode, container) {
    container.appendChild(newNode);

    this.dragNode(newNode, container, null);

    return newNode;
  }

  /**
   * Adds childNode to selected node, current node could be coreNode or ChildNode, all nodes could have its own ChildNode.
   * @param {PointerEvent} e - PointerEvent that comes from nodeMenu method.
   * @param {NodeCreator} nodeCreator - Instance of NodeCreator to create new nodes.
   * @param {HTMLElement} container - The parent container, normally dragZone, where all nodes are.
   * @param {HTMLElement | Null} parentNode - Null if it's a core node, parent node of current node (functionality element).
   */

  addChildNode(e, nodeCreator, container, parentNode) {
    // console.log({ e, nodeCreator, container, parentNode });

    const childNode = nodeCreator.createNode("ChildNode", { x: "30%", y: "15%" });

    // console.log(childNode);

    this.dragNode(childNode, container, parentNode);
    this.showNodeMethodsMenu(childNode, nodeCreator, container, childNode.querySelector(".btn-node"));
    this.appendNodeToDragZoneContainer(container, childNode);
  }

  /**
   * Inserts images to selected node.
   * @param {PointerEvent} e - PointerEvent that comes from nodeMenu method.
   * @param {HTMLElement} container - The parent container, normally dragZone, where all nodes are.
   * @param {HTMLElement | Null} parentNode - Null if it's a core node, parent node of current node (functionality element).
   */
  addImage(e, container, parentNode) {
    const img = document.createElement("img");
    img.src = "";
  }

  /**
   * Removes specific selected node.
   * @param {PointerEvent} e - PointerEvent that comes from nodeMenu method.
   * @param {HTMLElement} container - The parent container, normally dragZone, where all nodes are.
   * @param {HTMLElement | Null} parentNode - Null if it's a core node, parent node of current node (functionality element).
   */
  removeNode(e, container, parentNode) {
    const node = e.target.closest(".node");
    if (node) {
      node.remove();
    }
  }
}

const nodeCreator = new NodeCreator();
const nodeHandler = new NodeHandler();

export { nodeCreator, nodeHandler };
