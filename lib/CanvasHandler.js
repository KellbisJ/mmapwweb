export class CanvasHandler {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("canvas_branches");

    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "2";

    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    if (getComputedStyle(this.container).position === "static") {
      this.container.style.position = "relative";
    }

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    window.addEventListener("resize", () => this.resize());
    this.resize();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  clear() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  getNodeCenter(element) {
    const containerRect = this.container.getBoundingClientRect();
    const nodeRect = element.getBoundingClientRect();
    return {
      x: nodeRect.left + nodeRect.width / 2 - containerRect.left,
      y: nodeRect.top + nodeRect.height / 2 - containerRect.top,
    };
  }

  // destroy() {
  //   this.resizeObserver.disconnect();
  //   window.removeEventListener("resize", this.resize);
  //   this.canvas.remove();
  // }
}
