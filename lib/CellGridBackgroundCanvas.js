import { ThemeConfig, Themes } from "./themes";

export class CellGridBackgroundCanvas {
  constructor(canvasBackground) {
    this.canvasBackground = canvasBackground;
    this.ctx = this.canvasBackground.canvas.getContext("2d");

    this.cellSize = 0;
    this.columns = 0;
    this.rows = 0;

    this._theme = "dark";

    this.styles = {
      background: "#0c0e12",
      gridLine: "#2a2e38",
      gridLineAlpha: 0.3,
    };

    this.calculateGrid();
  }

  updateStyles(newStyles) {
    this.styles = { ...this.styles, ...newStyles };

    this.calculateGrid();
  }

  calculateGrid() {
    const width = this.canvasBackground.canvas.width;
    const height = this.canvasBackground.canvas.height;

    if (width <= 768) {
      this.cellSize = Math.min(width, height) / 18;
    } else {
      this.cellSize = Math.min(width, height) / 40;
    }
    this.cellSize = Math.max(this.cellSize, 8);

    this.columns = Math.ceil(width / this.cellSize) + 1;
    this.rows = Math.ceil(height / this.cellSize) + 1;

    this.drawAllCells();
  }

  /**
   * Draw a single cell border
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  drawOneCell(x, y) {
    const ctx = this.ctx;

    ctx.strokeStyle = this.styles.gridLine;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = this.styles.gridLineAlpha;

    ctx.strokeRect(x, y, this.cellSize, this.cellSize);

    ctx.globalAlpha = 1;
  }

  drawAllCells() {
    const width = this.canvasBackground.canvas.width;
    const height = this.canvasBackground.canvas.height;

    this.ctx.fillStyle = this.styles.background;
    this.ctx.fillRect(0, 0, width, height);

    // Skip drawing if cell size is invalid
    if (this.cellSize === 0) return;

    // Draw horizontal lines (top to bottom)
    for (let row = 0; row <= this.rows; row++) {
      const y = row * this.cellSize;

      this.ctx.strokeStyle = this.styles.gridLine;
      this.ctx.lineWidth = 0.5;
      this.ctx.globalAlpha = this.styles.gridLineAlpha;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
      this.ctx.globalAlpha = 1;
    }

    for (let col = 0; col <= this.columns; col++) {
      const x = col * this.cellSize;

      this.ctx.strokeStyle = this.styles.gridLine;
      this.ctx.lineWidth = 0.5;
      this.ctx.globalAlpha = this.styles.gridLineAlpha;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
      this.ctx.globalAlpha = 1;
    }
  }
}
