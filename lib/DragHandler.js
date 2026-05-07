export class DragHandler {
  constructor(container, onDragCallback) {
    this.container = container;
    this.onDragCallback = onDragCallback;
  }

  makeDraggable(element) {
    let isDragging = false;
    let startLeft, startTop, dragStartX, dragStartY;

    const onMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const clientX = e.clientX ?? (e.touches ? e.touches[0].clientX : 0);
      const clientY = e.clientY ?? (e.touches ? e.touches[0].clientY : 0);
      let newLeft = startLeft + (clientX - dragStartX);
      let newTop = startTop + (clientY - dragStartY);

      const containerRect = this.container.getBoundingClientRect();
      const elemRect = element.getBoundingClientRect();
      newLeft = Math.max(0, Math.min(newLeft, containerRect.width - elemRect.width));
      newTop = Math.max(0, Math.min(newTop, containerRect.height - elemRect.height));

      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;
      this.onDragCallback();
    };

    const onUp = () => {
      if (!isDragging) return;
      isDragging = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    };

    const onDown = (e) => {
      e.preventDefault();
      isDragging = true;
      dragStartX = e.clientX ?? (e.touches ? e.touches[0].clientX : 0);
      dragStartY = e.clientY ?? (e.touches ? e.touches[0].clientY : 0);
      startLeft = parseFloat(element.style.left);
      startTop = parseFloat(element.style.top);

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onUp);
    };

    element.addEventListener("mousedown", onDown);
    element.addEventListener("touchstart", onDown, { passive: false });
  }
}
