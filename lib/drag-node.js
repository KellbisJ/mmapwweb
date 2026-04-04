function dragNode(node, dragZone, parentNode) {
  if (!(node instanceof HTMLElement) || !(dragZone instanceof HTMLElement)) {
    console.error(`node must be a valid HTMLElement -> ${node}, dragZone must be a valid HTMLElement -> ${dragZone}`);
    return;
  }
  function dragStartPhase(e) {
    e.preventDefault();

    const target = node;

    const targetRect = target.getBoundingClientRect();
    const dragZoneRect = dragZone.getBoundingClientRect();

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
        ctx.clearRect(0, 0, dragZone.width, dragZone.height);

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

// function dragAllNodes(nodes, dragZone) {
//   if (!(nodes instanceof NodeList) || !(dragZone instanceof HTMLElement)) {
//     console.error(`NodeList? -> ${nodes}, dragZone must be a valid HTMLElement -> ${dragZone}`);
//     return;
//   }
//   nodes.forEach((node) => dragNode(node, dragZone));
// }

export { dragNode };
