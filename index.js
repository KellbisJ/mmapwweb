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
    const canvas = await html2canvas(graph.container);
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "mindmap.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  document.getElementById("exportPdf").addEventListener("click", async () => {
    const canvas = await html2canvas(graph.container);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();

    // Add the image to the PDF
    pdf.addImage(imgData, "PNG", 0, 0);

    // Save the PDF file
    pdf.save("mindmap.pdf");
  });
});
