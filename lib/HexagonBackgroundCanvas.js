export class HexagonBackgroundCanvas {
  constructor(canvasBackground) {
    this.canvasBackground = canvasBackground;
    this.ctx = this.canvasBackground.canvas.getContext("2d");

    this.hexSize = 0;
    this.rows = 0;
    this.cols = 0;

    this.colors = {
      background: "#0c0e12",
      hexagonStroke: "#3a4050",
    };

    this.calculateGrid();
  }

  calculateGrid() {
    const width = this.canvasBackground.canvas.width;
    const height = this.canvasBackground.canvas.height;

    if (width <= 768) {
      this.hexSize = Math.min(width, height) / 9;
    } else {
      this.hexSize = Math.min(width, height) / 20;
    }

    const hexWidth = this.hexSize * 2;
    const rowHeight = this.hexSize * Math.sqrt(3);

    this.rows = Math.ceil(height / rowHeight) + 4;
    this.cols = Math.ceil(width / hexWidth) + 2;

    this.drawAllHexagons();
  }

  drawOneHexagon(x, y, size) {
    const ctx = this.ctx;
    const centerX = x + size;
    const centerY = y + size;

    const width = this.canvasBackground.canvas.width;

    this.drawGradientHexagon(ctx, centerX, centerY, size);

    if (width <= 768) {
      ctx.strokeStyle = this.colors.hexagonStroke;
      ctx.lineWidth = 1.7;
      ctx.globalAlpha = 0.4;
      ctx.stroke();
    } else {
      ctx.strokeStyle = this.colors.hexagonStroke;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.3;
      ctx.stroke();
    }
  }

  drawGradientHexagon(ctx, cx, cy, r) {
    const gradient = ctx.createRadialGradient(cx - r / 3, cy - r / 3, r * 0.15, cx, cy, r);

    ctx.fillStyle = gradient;
    ctx.beginPath();

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  drawAllHexagons() {
    this.ctx.clearRect(0, 0, this.canvasBackground.canvas.width, this.canvasBackground.canvas.height);

    if (this.hexSize === 0) return;

    const hexWidth = this.hexSize * 2;
    const rowHeight = this.hexSize * Math.sqrt(3);

    for (let row = 0; row < this.rows; row++) {
      const offsetY = row * rowHeight;
      const startX = row % 2 === 0 ? 0 : hexWidth / 2;

      for (let col = 0; col < this.cols; col++) {
        const x = startX + col * hexWidth;

        this.drawOneHexagon(x, offsetY - this.hexSize / 2, this.hexSize, row % 2 === 0);
      }
    }
  }
}
