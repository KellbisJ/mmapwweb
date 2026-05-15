export class CanvasBranchDrawer {
  constructor(container, store, style = { color: "#60a5fa", width: 2, curveAmount: 0.15 }) {
    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("canvas_branches");

    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "2";

    this.container = container;

    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    // this.canvasManager = canvasManager;

    this.store = store;
    this.style = style;

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

  drawBranch(parentEl, childEl) {
    const from = this.getNodeCenter(parentEl);
    const to = this.getNodeCenter(childEl);
    const ctx = this.ctx;

    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const offsetX = -dy * this.style.curveAmount;
    const offsetY = dx * this.style.curveAmount;
    const cpX = midX + offsetX;
    const cpY = midY + offsetY;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo(cpX, cpY, to.x, to.y);
    ctx.strokeStyle = this.style.color;
    ctx.lineWidth = this.style.width;
    ctx.stroke();
  }

  getNodeCenter(element) {
    const containerRect = this.container.getBoundingClientRect();
    const nodeRect = element.getBoundingClientRect();
    return {
      x: nodeRect.left + nodeRect.width / 2 - containerRect.left,
      y: nodeRect.top + nodeRect.height / 2 - containerRect.top,
    };
  }

  redrawAll() {
    this.clear();
    for (const node of this.store.getAllNodes()) {
      if (node.parentId !== null) {
        const parent = this.store.getNode(node.parentId);
        if (parent?.element && node?.element) {
          this.drawBranch(parent.element, node.element);
        }
      }
    }
  }

  clear() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
