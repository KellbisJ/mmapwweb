export class BranchDrawer {
  constructor(canvasManager, store, style = { color: "#60a5fa", width: 2, curveAmount: 0.15 }) {
    this.canvasManager = canvasManager;
    this.store = store;
    this.style = style;
  }

  drawBranch(parentEl, childEl) {
    const from = this.canvasManager.getNodeCenter(parentEl);
    const to = this.canvasManager.getNodeCenter(childEl);
    const ctx = this.canvasManager.ctx;

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

  redrawAll() {
    this.canvasManager.clear();
    for (const node of this.store.getAllNodes()) {
      if (node.parentId !== null) {
        const parent = this.store.getNode(node.parentId);
        if (parent?.element && node?.element) {
          this.drawBranch(parent.element, node.element);
        }
      }
    }
  }
}
