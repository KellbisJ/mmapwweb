export class CanvasBranchDrawer {
  constructor(container, store, style = { color: "#60a5fa", width: 2, curveAmount: 0.15 }) {
    this.container = container;
    this.store = store;
    this.style = style;

    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("canvas_branches");

    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.width = "100%";
    this.canvas.style.minHeight = "100vh";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "2";
    this.canvas.style.transform = "translateZ(0)";

    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
      requestAnimationFrame(() => this.redrawAll());
    });

    this.resizeObserver.observe(this.container);

    window.addEventListener("resize", () => {
      this.resize();
      requestAnimationFrame(() => this.redrawAll());
    });
  }

  resize() {
    const rect = this.container.getBoundingClientRect();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvas.width = Math.round(rect.width * window.devicePixelRatio);
    this.canvas.height = Math.round(rect.height * window.devicePixelRatio);

    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  getNodeCenter(element) {
    const containerRect = this.container.getBoundingClientRect();
    const nodeRect = element.getBoundingClientRect();

    return {
      x: nodeRect.left + nodeRect.width / 2 - containerRect.left,
      y: nodeRect.top + nodeRect.height / 2 - containerRect.top,
    };
  }

  drawBranch(parentEl, childEl, from, to) {
    const containerRect = this.container.getBoundingClientRect();

    if (this.canvas.width !== Math.round(containerRect.width * window.devicePixelRatio) || this.canvas.height !== Math.round(containerRect.height * window.devicePixelRatio)) {
      this.resize();
    }

    const ctx = this.ctx;

    const scaleX = this.canvas.width / window.innerWidth / window.devicePixelRatio;
    const scaleY = this.canvas.height / window.innerHeight / window.devicePixelRatio;

    const midX = ((from.x + to.x) / 2) * scaleX;
    const midY = ((from.y + to.y) / 2) * scaleY;
    const dx = (to.x - from.x) * scaleX;
    const dy = (to.y - from.y) * scaleY;

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

  redrawAll() {
    // console.log("redrawAll InitialLog");

    this.clear();

    // console.log("redrawAll clear");

    // Ensure canvas matches container size
    const rect = this.container.getBoundingClientRect();
    if (this.canvas.width !== Math.round(rect.width) || this.canvas.height !== Math.round(rect.height)) {
      this.resize();
      // console.log("redrawAll this.canvas.width !== Math.round(rect.width) || this.canvas.height !== Math.round(rect.height)");
    }
    // console.log("redrawAll continues?");

    for (const node of this.store.getAllNodes()) {
      // console.log("redrawAll this.tore.getallNodes", this.store.getAllNodes());
      if (node.parentId !== null && node.parentId !== undefined) {
        // console.log("redrawAll node.parentId !== null && node.parentId !== undefined");
        const parent = this.store.getNode(node.parentId);

        // console.log("redrawAll parent", parent);

        if (parent?.element && node.element && parent.element.isConnected && node.element.isConnected) {
          // console.log("redrawAll parent?.element && node.element && parent.element.isConnected && node.element.isConnected");
          const from = this.getNodeCenter(parent.element);
          const to = this.getNodeCenter(node.element);

          this.drawBranch(parent.element, node.element, from, to);
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
