import { ThemeConfig, Themes } from "./themes.js";

/**
 * DiamondLatticeBackgroundCanvas - A modern diamond lattice pattern
 * Features:
 * - Intersecting diagonal lines forming diamond shapes
 * - Clean, geometric, architectural aesthetic
 * - Responsive sizing based on viewport
 * - Light/dark theme support
 * - No animations
 */
export class DiamondLatticeBackgroundCanvas {
  constructor(canvasBackground) {
    this.canvasBackground = canvasBackground;
    this.ctx = this.canvasBackground.canvas.getContext("2d");

    this.diamondSize = 0;
    this.lineWidth = 0;
    this.columns = 0;
    this.rows = 0;

    this._theme = "dark";

    this.styles = {
      background: "#0c0e12",
      lineColor: "#3a4050",
      lineAlpha: 0.25,
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

    // Responsive sizing
    if (width <= 768) {
      this.diamondSize = Math.min(width, height) / 14;
    } else {
      this.diamondSize = Math.min(width, height) / 32;
    }

    this.diamondSize = Math.max(this.diamondSize, 20);
    this.lineWidth = Math.max(0.8, this.diamondSize / 40);

    // Calculate how many diamonds fit across and down
    // Each diamond is diamondSize wide and diamondSize tall
    this.columns = Math.ceil(width / this.diamondSize) + 2;
    this.rows = Math.ceil(height / this.diamondSize) + 2;

    this.drawAllDiamonds();
  }

  drawAllDiamonds() {
    const width = this.canvasBackground.canvas.width;
    const height = this.canvasBackground.canvas.height;

    // Fill background
    this.ctx.fillStyle = this.styles.background;
    this.ctx.fillRect(0, 0, width, height);

    if (this.diamondSize === 0) return;

    const ctx = this.ctx;
    ctx.strokeStyle = this.styles.lineColor;
    ctx.lineWidth = this.lineWidth;
    ctx.globalAlpha = this.styles.lineAlpha;
    ctx.lineCap = "round";

    const halfDiamond = this.diamondSize / 2;

    // Draw forward diagonal lines (\) - from top-left to bottom-right
    for (let i = -this.rows; i < this.columns; i++) {
      const startX = i * halfDiamond;
      const startY = 0;
      const endX = startX + height;
      const endY = height;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Draw backward diagonal lines (/) - from top-right to bottom-left
    for (let i = -this.rows; i < this.columns; i++) {
      const startX = width - i * halfDiamond;
      const startY = 0;
      const endX = startX - height;
      const endY = height;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }
}