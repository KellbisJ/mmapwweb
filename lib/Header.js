import feather from "feather-icons";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export class HeaderManager {
  constructor({ nodeGraph, backgroundHandler }) {
    this.nodeGraph = nodeGraph;
    this.backgroundHandler = backgroundHandler;
    this.isDarkMode = backgroundHandler.getCurrentTheme();

    this.init();
  }

  init() {
    this.header = document.createElement("header");
    this.header.className = "header";

    // Left Group (New Node)
    const leftGroup = this.createFlexGroup();
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

    const exportPngBtn = this.createButton({
      id: "exportPng",
      icon: "image",
      text: "Export PNG",
    });

    exportPngBtn.addEventListener("click", async () => {
      const container = this.nodeGraph.container;

      const canvas = await html2canvas(container, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: "#0c0e12",
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
      const container = this.nodeGraph.container;
      const canvas = await html2canvas(container, {
        useCORS: true,
        scale: 2,
        backgroundColor: "#0c0e12",
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

    rightGroup.el.appendChild(exportPngBtn);
    rightGroup.el.appendChild(exportPdfBtn);

    const divider = document.createElement("div");
    divider.className = "header__divider";

    rightGroup.el.appendChild(this.themeBtn);

    this.header.appendChild(leftGroup.el);
    this.header.appendChild(divider);
    this.header.appendChild(rightGroup.el);

    const mainElement = document.querySelector("main");

    mainElement.prepend(this.header);

    requestAnimationFrame(() => {
      this.header.classList.add("visible");
    });
  }

  createFlexGroup() {
    const div = document.createElement("div");
    div.className = "header__gap";

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
// const addBtn = document.getElementById("addNode");
// if (addBtn) {
//   addBtn.addEventListener("click", () => {
//     graph.createNode("Node");
//   });
// }

// document.getElementById("exportPng").addEventListener("click", async () => {
//   const container = graph.container;

//   const canvas = await html2canvas(container, {
//     useCORS: true,
//     allowTaint: true,
//     scale: 2,
//     backgroundColor: "#0c0e12",
//     logging: false,
//     ignoreBackground: false,
//     scrollX: 0,
//     scrollY: 0,
//     windowWidth: container.scrollWidth,
//     windowHeight: container.scrollHeight,
//     foreignObjectRendering: true,
//   });

//   const dataURL = canvas.toDataURL("image/png");
//   const link = document.createElement("a");
//   link.href = dataURL;
//   link.download = "mindmap.png";
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// });

// document.getElementById("exportPdf").addEventListener("click", async () => {
//   const container = graph.container;

//   const canvas = await html2canvas(container, {
//     useCORS: true,
//     scale: 2,
//     backgroundColor: "#0c0e12",
//     logging: false,
//     foreignObjectRendering: true,
//     windowWidth: container.scrollWidth,
//     windowHeight: container.scrollHeight,
//   });

//   const imgData = canvas.toDataURL("image/jpeg");

//   const imgWidth = canvas.width;
//   const imgHeight = canvas.height;
//   const aspectRatio = imgWidth / imgHeight;

//   const PDF_WIDTH = 595;
//   const PDF_HEIGHT = 842;

//   let finalPdfWidth = PDF_WIDTH;
//   let finalPdfHeight = PDF_HEIGHT;
//   let orientation = "portrait";

//   if (aspectRatio > 1) {
//     orientation = "landscape";
//     finalPdfWidth = PDF_HEIGHT;
//     finalPdfHeight = PDF_WIDTH;
//   }

//   const margin = 12;
//   const availableWidth = finalPdfWidth - margin * 2;
//   const availableHeight = finalPdfHeight - margin * 2;

//   let renderWidth = availableWidth;
//   let renderHeight = (imgHeight / imgWidth) * renderWidth;

//   if (renderHeight > availableHeight) {
//     renderHeight = availableHeight;
//     renderWidth = (imgWidth / imgHeight) * renderHeight;
//   }

//   const pdf = new jsPDF({
//     orientation: orientation,
//     unit: "pt",
//     format: [finalPdfWidth, finalPdfHeight],
//   });

//   const xOffset = (finalPdfWidth - renderWidth) / 2;
//   const yOffset = (finalPdfHeight - renderHeight) / 2;

//   pdf.addImage(imgData, "JPEG", xOffset, yOffset, renderWidth, renderHeight);
//   pdf.save("mindmap.pdf");
// });
