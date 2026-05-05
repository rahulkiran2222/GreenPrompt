import jsPDF from "jspdf";
import type { BattleResult } from "./types";

export function exportBattleToPDF(data: BattleResult) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = 50;

  // Watermark drawer (called on every page)
  const drawWatermark = () => {
    try {
      doc.saveGraphicsState();
      // @ts-ignore
      doc.setGState(new (doc as any).GState({ opacity: 0.05 }));
      doc.setFontSize(90);
      doc.setTextColor(16, 185, 129);
      doc.setFont("helvetica", "bold");
      doc.text("GREENPROMPT", pageWidth / 2, pageHeight / 2, {
        align: "center",
        angle: 45,
      });
      doc.restoreGraphicsState();
    } catch {
      // Some jsPDF builds may not have GState — silently skip
    }
  };

  drawWatermark();

  // Header bar
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("GreenPrompt — Sustainability Report", margin, 20);
  doc.setFont("helvetica", "normal");
  doc.text(new Date().toLocaleString(), pageWidth - margin - 130, 20);

  // Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  y = 75;
  doc.text("Battle Mode Results", margin, y);

  // Prompt
  y += 28;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Prompt:", margin, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  const promptLines = doc.splitTextToSize(data.prompt, pageWidth - margin * 2);
  doc.text(promptLines, margin, y);
  y += promptLines.length * 14 + 16;

  // Winners banner
  doc.setFillColor(220, 252, 231);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 42, 6, 6, "F");
  doc.setTextColor(5, 150, 105);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Greenest: ${data.most_sustainable || "N/A"}`,
    margin + 14,
    y + 17
  );
  doc.text(
    `Fastest: ${data.fastest || "N/A"}`,
    margin + 280,
    y + 17
  );
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    "Lower energy consumption = more sustainable.  Lower latency = faster.",
    margin + 14,
    y + 33
  );
  y += 58;

  // Per-model section
  data.results.forEach((r, idx) => {
    if (y > 700) {
      doc.addPage();
      drawWatermark();
      y = 50;
    }

    // Card border
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 135, 5, 5, "S");

    // Model name
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`${idx + 1}. ${r.model}`, margin + 14, y + 20);

    // Badges
    const badges: string[] = [];
    if (r.model === data.most_sustainable) badges.push("GREENEST");
    if (r.model === data.fastest) badges.push("FASTEST");
    if (badges.length) {
      doc.setFontSize(8);
      doc.setTextColor(5, 150, 105);
      doc.setFont("helvetica", "bold");
      doc.text(badges.join("  •  "), pageWidth - margin - 110, y + 20);
    }

    // Metrics row
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const metricsY = y + 40;
    doc.text(`Tokens: ${r.tokens}`, margin + 14, metricsY);
    doc.text(`Latency: ${r.latency_ms.toFixed(0)} ms`, margin + 130, metricsY);
    doc.text(`Energy: ${r.energy_wh.toFixed(6)} Wh`, margin + 250, metricsY);
    doc.text(`CO2: ${r.co2_g.toFixed(6)} g`, margin + 400, metricsY);

    // Response or error
    doc.setFontSize(9);
    if (r.error) {
      doc.setTextColor(220, 38, 38);
      const lines = doc.splitTextToSize(
        `Error: ${r.error}`,
        pageWidth - margin * 2 - 28
      );
      doc.text(lines.slice(0, 5), margin + 14, y + 60);
    } else {
      doc.setTextColor(30, 41, 59);
      const lines = doc.splitTextToSize(
        r.response || "(empty response)",
        pageWidth - margin * 2 - 28
      );
      doc.text(lines.slice(0, 5), margin + 14, y + 60);
    }
    y += 150;
  });

  // Methodology footer
  if (y > 680) {
    doc.addPage();
    drawWatermark();
    y = 50;
  }
  y += 12;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Methodology", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  y += 14;
  const methodology = [
    "Energy estimates use research-aligned coefficients (Wh per 1k tokens):",
    "  GPT-4o: 0.005   |   GPT-4o-mini: 0.0004   |   Gemini 2.5 Pro: 0.004   |   Gemini 2.5 Flash: 0.0003",
    "  Claude Sonnet: 0.0045   |   Claude Haiku: 0.0005   |   Llama 70B: 0.0008   |   Llama 8B: 0.0001",
    "Carbon intensity: 0.475 g CO2e per Wh (IEA 2023 global grid average).",
    "References: Patterson et al. 2021 (arXiv:2104.10350); Luccioni et al. 2023 (JMLR);",
    "Strubell et al. 2019 (ACL). True values vary by hardware, batching, and PUE.",
  ];
  methodology.forEach((line) => {
    doc.text(line, margin, y);
    y += 12;
  });

  // Footer
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.text(
    "GreenPrompt by Raphus Solutions  -  greenprompt.raphussolutions.com",
    margin,
    pageHeight - 25
  );

  const filename = `greenprompt-battle-${Date.now()}.pdf`;
  doc.save(filename);
}