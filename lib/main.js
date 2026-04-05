class NodeCreator {
  /**
   * Creates the basic structure for a node.
   * @param {string} type - The type of node (e.g., "CoreNode", "ChildNode").
   * @param {object} coordinates - The position {x, y} to generate the node.
   * @returns {HTMLElement} The newly created node element.
   */
  createNode(type, coordinates, mainMethods) {
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
   * @param {HTMLElement} node - The node element to handle, add functionalities or manipulate.
   * @param {string} type - The type of node (e.g., "CoreNode", "ChildNode").
   * @param {object} coordinates - Coordinates {x, y} to manipulate node.
   * @param {string} branch - Branch information (true | false).
   * @param {HTMLElement} container - The parent container, normally dragZone, where all nodes are.
   * @param {HTMLElement} parentNode - Parent node of current node (functionality element).
   */

  appendNodeToDragZoneContainer(container, node) {
    container.appendChild(node);
  }

  dragNode(node, container, parentNode) {
    if (!(node instanceof HTMLElement) || !(container instanceof HTMLElement)) {
      console.error(`node must be a valid HTMLElement -> ${node}, container (dragZone) must be a valid HTMLElement -> ${dragZone}`);
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
          const dragZoneRect = dragZone.getBoundingClientRect();

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

  showNodeMethodsMenu() {}

  // dragNode(node, container);
  // showNodeMethodsMenu(node, btnNode);

  addImage(e, parentNode) {
    const img = document.createElement("img");
    img.src = "";
  }

  removeNode(e, parentNode) {
    const node = e.target.closest(".node");
    if (node) {
      node.remove();
    }
  }
}

export { NodeCreator, NodeHandler };
