import { NodeGraph } from "./lib/NodeGraph.js";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

document.addEventListener("DOMContentLoaded", () => {
  const graph = new NodeGraph("dragZone");

  graph.headerDraggable();
  graph.createNode("Main Idea");

  const addBtn = document.getElementById("addNode");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      graph.createNode("Node");
    });
  }

  document.getElementById("exportPng").addEventListener("click", async () => {
    const container = graph.container;

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

  document.getElementById("exportPdf").addEventListener("click", async () => {
    const container = graph.container;

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
});
