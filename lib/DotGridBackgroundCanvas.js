/**
 * DotGridBackgroundCanvas - A modern dot-grid background pattern
 * Features:
 * - Clean, minimal dot matrix design
 * - Responsive sizing based on viewport
 * - Light/dark theme support
 * - No animations
 */
export class DotGridBackgroundCanvas {
  constructor(canvasBackground) {
    this.canvasBackground = canvasBackground;
    this.ctx = this.canvasBackground.canvas.getContext("2d");

    this.dotSize = 0;
    this.dotSpacing = 0;
    this.columns = 0;
    this.rows = 0;

    this._theme = "dark";

    this.styles = {
      background: "#0c0e12",
      dotColor: "#3a4050",
      dotAlpha: 0.35,
    };

    this.calculateGrid();
  }

  calculateGrid() {
    const width = this.canvasBackground.canvas.width;
    const height = this.canvasBackground.canvas.height;

    // Responsive sizing: smaller dots on mobile, larger grid on desktop
    if (width <= 768) {
      this.dotSpacing = Math.min(width, height) / 22;
      this.dotSize = Math.max(1.5, this.dotSpacing / 12);
    } else {
      this.dotSpacing = Math.min(width, height) / 48;
      this.dotSize = Math.max(1, this.dotSpacing / 16);
    }

    this.dotSpacing = Math.max(this.dotSpacing, 12);
    this.dotSize = Math.max(this.dotSize, 0.8);

    this.columns = Math.ceil(width / this.dotSpacing) + 1;
    this.rows = Math.ceil(height / this.dotSpacing) + 1;

    this.drawAllDots();
  }

  drawAllDots() {
    const width = this.canvasBackground.canvas.width;
    const height = this.canvasBackground.canvas.height;

    this.canvasBackground.fillBackground();

    if (this.dotSpacing === 0 || this.dotSize === 0) return;

    const ctx = this.ctx;
    ctx.fillStyle = this.styles.dotColor;
    ctx.globalAlpha = this.styles.dotAlpha;

    // Draw dots in a grid pattern
    for (let row = 0; row <= this.rows; row++) {
      const y = row * this.dotSpacing + this.dotSpacing / 2;

      for (let col = 0; col <= this.columns; col++) {
        const x = col * this.dotSpacing + this.dotSpacing / 2;

        ctx.beginPath();
        ctx.arc(x, y, this.dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }
}
