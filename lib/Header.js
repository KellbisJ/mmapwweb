import feather from "feather-icons";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ThemeConfig } from "./themes";

export class HeaderManager {
  constructor({ nodeGraph, backgroundHandler }) {
    this.nodeGraph = nodeGraph;
    this.backgroundHandler = backgroundHandler;
    this.isDarkMode = backgroundHandler.getCurrentTheme();
    this.isMenuOpen = false;
    this.isMobile = window.innerWidth <= 768;

    this.init();
  }

  init() {
    this.header = document.createElement("header");
    this.header.className = "header";

    // Left Group (New Node)
    const leftGroup = this.createFlexGroup();
    leftGroup.setLeft();
    const addNodeBtn = this.createButton({
      id: "addNode",
      icon: "plus-circle",
      text: "New Node",
      type: "primary",
    });
    addNodeBtn.addEventListener("click", () => {
      this.nodeGraph.createNode("Node");
    });

    leftGroup.el.appendChild(addNodeBtn);

    // Right Group (Exports + Theme)
    const rightGroup = this.createFlexGroup();
    rightGroup.setRight();

    const exportPngBtn = this.createButton({
      id: "exportPng",
      icon: "image",
      text: "Export PNG",
    });

    exportPngBtn.addEventListener("click", async () => {
      this.nodeGraph.deselectAllNodes();
      const container = this.nodeGraph.container;

      const canvas = await html2canvas(container, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: ThemeConfig[this.backgroundHandler.getCurrentTheme()].background,
        logging: false,
        ignoreBackground: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: container.scrollWidth,
        windowHeight: container.scrollHeight,
        foreignObjectRendering: true,
      });

      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "mindmap.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    const exportPdfBtn = this.createButton({
      id: "exportPdf",
      icon: "file-text",
      text: "Export PDF",
    });

    exportPdfBtn.addEventListener("click", async () => {
      this.nodeGraph.deselectAllNodes();
      const container = this.nodeGraph.container;
      const canvas = await html2canvas(container, {
        useCORS: true,
        scale: 2,
        backgroundColor: ThemeConfig[this.backgroundHandler.getCurrentTheme()].background,
        logging: false,
        foreignObjectRendering: true,
        windowWidth: container.scrollWidth,
        windowHeight: container.scrollHeight,
      });
      const imgData = canvas.toDataURL("image/jpeg");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const aspectRatio = imgWidth / imgHeight;
      const PDF_WIDTH = 595;
      const PDF_HEIGHT = 842;
      let finalPdfWidth = PDF_WIDTH;
      let finalPdfHeight = PDF_HEIGHT;
      let orientation = "portrait";
      if (aspectRatio > 1) {
        orientation = "landscape";
        finalPdfWidth = PDF_HEIGHT;
        finalPdfHeight = PDF_WIDTH;
      }
      const margin = 12;
      const availableWidth = finalPdfWidth - margin * 2;
      const availableHeight = finalPdfHeight - margin * 2;
      let renderWidth = availableWidth;
      let renderHeight = (imgHeight / imgWidth) * renderWidth;
      if (renderHeight > availableHeight) {
        renderHeight = availableHeight;
        renderWidth = (imgWidth / imgHeight) * renderHeight;
      }
      const pdf = new jsPDF({
        orientation: orientation,
        unit: "pt",
        format: [finalPdfWidth, finalPdfHeight],
      });
      const xOffset = (finalPdfWidth - renderWidth) / 2;
      const yOffset = (finalPdfHeight - renderHeight) / 2;
      pdf.addImage(imgData, "JPEG", xOffset, yOffset, renderWidth, renderHeight);
      pdf.save("mindmap.pdf");
    });

    this.themeBtn = this.createThemedButton();

    this.backgroundBtn = this.createBackgroundSwitcherButton();

    rightGroup.el.appendChild(exportPngBtn);
    rightGroup.el.appendChild(exportPdfBtn);

    const divider = document.createElement("div");
    divider.className = "header__divider";

    rightGroup.el.appendChild(this.themeBtn);
    rightGroup.el.appendChild(this.backgroundBtn);

    this.header.appendChild(leftGroup.el);
    this.header.appendChild(divider);
    this.header.appendChild(rightGroup.el);

    const mainElement = document.querySelector("main");

    mainElement.prepend(this.header);

    requestAnimationFrame(() => {
      this.header.classList.add("visible");
      this.updateButtonPositioning();
    });

    window.addEventListener("resize", () => {
      if (this.isMobile) {
        this.updateButtonPositioning();
      }
    });
  }

  updateButtonPositioning() {
    if (!this.header || !this.backgroundBtn) {
      return;
    }

    if (!this.headerRightGroup) {
      this.headerRightGroup = this.header.querySelector(".header__right-group");
    }

    const isMobile = window.innerWidth <= 768;
    const isInHeader = this.headerRightGroup.contains(this.backgroundBtn);

    const shouldBeInHeader = !isMobile;
    const needsMoving = shouldBeInHeader !== isInHeader;

    if (needsMoving) {
      if (isMobile) {
        if (isInHeader) {
          this.headerRightGroup.removeChild(this.backgroundBtn);
        }
        document.body.appendChild(this.backgroundBtn);
        this.backgroundBtn.classList.add("mobile-positioned");
      } else {
        if (!isInHeader) {
          document.body.removeChild(this.backgroundBtn);
        }
        this.headerRightGroup.appendChild(this.backgroundBtn);
        this.backgroundBtn.classList.remove("mobile-positioned");
      }
    }
  }

  /**
   * Create the background switcher button with dropdown menu.
   *
   * @returns {HTMLElement} The button element
   */
  createBackgroundSwitcherButton() {
    // Create the button
    const btn = document.createElement("button");
    btn.id = "backgroundSwitcherBtn";
    btn.className = "btn_header";
    btn.type = "button";
    btn.title = "Change Background";

    const iconContainer = document.createElement("i");
    iconContainer.className = "feather-icon";
    iconContainer.innerHTML = feather.icons["grid"].toSvg();
    btn.appendChild(iconContainer);

    // Create the dropdown menu
    const menu = this.createBackgroundMenu();
    btn.appendChild(menu);

    // Toggle menu on click
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleBackgroundMenu();
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (this.isMenuOpen && !btn.contains(e.target)) {
        this.closeBackgroundMenu();
      }
    });

    return btn;
  }

  /**
   * Create the background selection menu.
   *
   * @returns {HTMLElement} The menu element
   */
  createBackgroundMenu() {
    const menu = document.createElement("div");
    menu.id = "backgroundMenu";
    menu.className = "header__background-menu";
    menu.style.display = "none";

    const header = document.createElement("div");
    header.className = "header__background-menu-title";
    header.textContent = "Background";
    menu.appendChild(header);

    const divider = document.createElement("div");
    divider.className = "header__menu-divider";
    menu.appendChild(divider);

    // none (no backgorund)
    const noneItem = this.createBackgroundMenuItem("none");
    menu.appendChild(noneItem);

    const availableTypes = this.backgroundHandler.getAvailableBackgroundTypes();

    availableTypes.forEach((type) => {
      const item = this.createBackgroundMenuItem(type);
      menu.appendChild(item);
    });

    return menu;
  }

  /**
   * Create a single background menu item.
   *
   * @param {string} type - Background type identifier
   * @returns {HTMLElement} The menu item element
   */
  createBackgroundMenuItem(type) {
    const item = document.createElement("div");
    item.className = "header__menu-item";
    item.dataset.type = type;

    const currentType = this.backgroundHandler.getCurrentBackgroundType();
    const isNoBackground = this.backgroundHandler.getNoBackground();

    if (type === currentType || (type === "none" && isNoBackground)) {
      item.classList.add("active");
    }

    let text;
    if (type === "none") {
      text = "None";
    } else {
      text = type.charAt(0).toUpperCase() + type.slice(1);
    }

    const span = document.createElement("span");
    span.textContent = text;

    item.appendChild(span);

    item.addEventListener("click", (e) => {
      e.stopPropagation();
      this.switchBackground(type);
    });

    return item;
  }

  /**
   * Toggle the background menu visibility.
   */
  toggleBackgroundMenu() {
    const menu = document.getElementById("backgroundMenu");
    if (!menu) return;

    this.isMenuOpen = !this.isMenuOpen;
    menu.style.display = this.isMenuOpen ? "block" : "none";
  }

  /**
   * Close the background menu.
   */
  closeBackgroundMenu() {
    const menu = document.getElementById("backgroundMenu");
    if (!menu) return;

    this.isMenuOpen = false;
    menu.style.display = "none";
  }

  /**
   * Switch to a different background type.
   *
   * @param {string} type - Background type to switch to
   */
  switchBackground(type) {
    if (type === "none") {
      this.backgroundHandler.setNoBackground(true);
      this.updateBackgroundMenuUI("none");
      this.closeBackgroundMenu();
      return;
    }

    // Validate the type using CanvasBackground method
    if (!this.backgroundHandler.isBackgroundRegistered(type)) {
      console.warn(`Background type "${type}" is not registered.`);
      return;
    }

    // Switch the background
    this.backgroundHandler.setBackground(type);

    // Update the menu to reflect the change
    this.updateBackgroundMenuUI(type);

    // Close the menu
    this.closeBackgroundMenu();
  }

  /**
   * Update the background menu UI to show the active item.
   *
   * @param {string} activeType - The newly active background type
   */
  updateBackgroundMenuUI(activeType) {
    const menu = document.getElementById("backgroundMenu");
    if (!menu) return;

    // Remove active state from all items
    const items = menu.querySelectorAll(".header__menu-item");
    items.forEach((item) => {
      const itemType = item.dataset.type;
      if (itemType === activeType) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  createFlexGroup() {
    const div = document.createElement("div");

    return {
      el: div,
      setLeft() {
        this.el.className = "header__left-group";
      },
      setRight() {
        this.el.className = "header__right-group";
      },
    };
  }

  createButton({ id, icon, text, type = "" }) {
    const btn = document.createElement("button");
    btn.id = id;
    let classes = "btn_header";

    if (type === "primary") classes += " primary";

    btn.className = classes;
    btn.type = "button";

    const iconContainer = document.createElement("i");
    iconContainer.className = "feather-icon";

    if (feather.icons[icon]) {
      iconContainer.innerHTML = feather.icons[icon].toSvg();
    }

    btn.appendChild(iconContainer);

    if (text) {
      const span = document.createElement("span");
      span.className = "btn_text";
      span.textContent = text;
      btn.appendChild(span);
    }

    return btn;
  }

  createThemedButton() {
    const btn = document.createElement("button");
    btn.id = "toggleThemeBtn";
    btn.className = "btn_header";
    btn.type = "button";

    const iconContainer = document.createElement("i");
    iconContainer.className = "feather-icon";

    this.updateThemeIcon(iconContainer);

    btn.appendChild(iconContainer);

    btn.addEventListener("click", () => {
      this.toggleTheme();
      this.updateThemeIcon(iconContainer);
    });

    return btn;
  }

  updateThemeIcon(container) {
    this.isDarkMode = !this.isDarkMode;

    const iconName = this.isDarkMode ? "moon" : "sun";

    if (feather.icons[iconName]) {
      container.innerHTML = feather.icons[iconName].toSvg();
    }
  }

  toggleTheme() {
    if (this.backgroundHandler) {
      this.backgroundHandler.toggleTheme();
    }
  }
}
