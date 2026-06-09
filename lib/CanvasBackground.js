import { ThemeConfig, Themes } from "./themes";
import { HexagonBackgroundCanvas } from "./HexagonBackgroundCanvas";

export class CanvasBackground {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("canvas_background");

    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.minHeight = "100vh";
    this.canvas.style.height = "100%";
    this.canvas.style.zIndex = "1";
    this.canvas.style.pointerEvents = "none";

    this.initializer();

    this.theme = "dark";
    this.activeBackground = new HexagonBackgroundCanvas(this);

    this.applyCurrentThemeStyles();

    this.ctx = this.canvas.getContext("2d");

    this.resizeObserver = new ResizeObserver(() => {
      this.updateCanvasState();
    });

    this.resizeObserver.observe(this.container);

    window.addEventListener("resize", () => {
      this.updateCanvasState();
    });

    window.addEventListener("orientationchange", () => {
      this.updateCanvasState();
    });
  }

  initializer() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.container.appendChild(this.canvas);
  }

  updateCanvasState() {
    this.canvas.width = this.container.getBoundingClientRect().width * window.devicePixelRatio;
    this.canvas.height = this.container.getBoundingClientRect().height * window.devicePixelRatio;

    if (this.activeBackground) {
      this.activeBackground.calculateGrid();
    }
  }

  applyCurrentThemeStyles() {
    const themeData = ThemeConfig[this.theme];

    if (this.activeBackground && typeof this.activeBackground.updateStyles === "function") {
      this.activeBackground.updateStyles(themeData);
    }

    this.activeBackground.calculateGrid();
  }

  setTheme(themeName) {
    if (!Themes.includes(themeName)) {
      console.error(`invalid theme: ${themeName}`);
      return;
    }

    this.theme = themeName;
    this.applyCurrentThemeStyles();
  }

  toggleTheme() {
    const nextTheme = this.theme === "dark" ? "light" : "dark";
    this.setTheme(nextTheme);
  }
  getCurrentTheme() {
    return this.theme;
  }

  clear() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
