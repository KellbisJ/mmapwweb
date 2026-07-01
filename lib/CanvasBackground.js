import { ThemeConfig, Themes } from "./themes.js";
import { HexagonBackgroundCanvas } from "./HexagonBackgroundCanvas.js";
import { CellGridBackgroundCanvas } from "./CellGridBackgroundCanvas.js";
import { DotGridBackgroundCanvas } from "./DotGridBackgroundCanvas.js";
import { DiamondLatticeBackgroundCanvas } from "./DiamondLatticeBackgroundCanvas.js";

const BACKGROUND_REGISTRY = {
  hexagon: HexagonBackgroundCanvas,
  cellgrid: CellGridBackgroundCanvas,
  dotgrid: DotGridBackgroundCanvas,
  diamondlattice: DiamondLatticeBackgroundCanvas,
};

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
    this.activeBackground = null;
    this.currentBackgroundType = "hexagon";
    this.noBackground = false;

    this.setActiveBackground("hexagon");

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

    if (this.activeBackground && !this.noBackground) {
      this.activeBackground.calculateGrid();
    }
  }

  applyCurrentThemeStyles() {
    const themeData = ThemeConfig[this.theme];

    if (themeData && themeData.background) {
      document.documentElement.style.setProperty("--color-bg-primary", themeData.background);
    }

    if (this.activeBackground && !this.noBackground) {
      this.updateStyles(themeData);
    }
  }

  /**
   * Updates styles for the active background pattern and triggers recalculation
   * @param {Object} newStyles - Styles to merge into the active background
   */
  updateStyles(newStyles) {
    if (!this.activeBackground) return;

    // Merge new styles into the active background's styles
    this.activeBackground.styles = { ...this.activeBackground.styles, ...newStyles };

    // Trigger recalculation if the method exists
    if (typeof this.activeBackground.calculateGrid === "function") {
      this.activeBackground.calculateGrid();
    }
  }

  /**
   * Fills the canvas with the background color from the active pattern
   */
  fillBackground() {
    if (!this.ctx || !this.activeBackground) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const style = this.activeBackground.styles;

    if (style?.background) {
      this.ctx.fillStyle = style.background;
      this.ctx.fillRect(0, 0, width, height);
    }
  }

  setActiveBackground(backgroundType) {
    // Validate the background type
    if (!this.isBackgroundRegistered(backgroundType)) {
      console.warn(`Background type "${backgroundType}" is not registered. Using "hexagon" as fallback.`);
      backgroundType = "hexagon";
    }

    // Create a new background instance
    const BackgroundClass = BACKGROUND_REGISTRY[backgroundType];
    const newBackground = new BackgroundClass(this);

    // Update the active background reference
    this.activeBackground = newBackground;

    // Disable no-background mode when switching to a pattern
    this.noBackground = false;

    // Update the local state
    this.currentBackgroundType = backgroundType;

    // Trigger a grid calculation to render the new pattern
    if (typeof newBackground.calculateGrid === "function") {
      newBackground.calculateGrid();
    }

    // console.log(`Background switched to: ${backgroundType}`);
  }

  setNoBackground(value) {
    this.noBackground = value;
    if (value) {
      this.clear();
    } else if (this.activeBackground) {
      this.activeBackground.calculateGrid();
    }
  }

  getNoBackground() {
    return this.noBackground;
  }

  getCurrentBackgroundType() {
    return this.currentBackgroundType;
  }

  getAvailableBackgroundTypes() {
    return Object.keys(BACKGROUND_REGISTRY);
  }

  isBackgroundRegistered(type) {
    return BACKGROUND_REGISTRY.hasOwnProperty(type);
  }

  setBackground(type) {
    this.setActiveBackground(type);
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
