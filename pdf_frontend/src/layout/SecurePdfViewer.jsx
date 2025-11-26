// src/components/SecurePdfViewer.jsx
import { useEffect, useRef } from "react";
import {
  GlobalWorkerOptions,
  getDocument,
} from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import "pdfjs-dist/web/pdf_viewer.css";

GlobalWorkerOptions.workerSrc = pdfWorker;

export default function SecurePdfViewer({ pdfData }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!pdfData || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = ""; // clear previous pages

    // ArrayBuffer → Uint8Array
    const uint8Data =
      pdfData instanceof Uint8Array ? pdfData : new Uint8Array(pdfData);

    const loadingTask = getDocument({ data: uint8Data });
    let cancelled = false;
    const renderTasks = [];

    loadingTask.promise
      .then(async (pdf) => {
        if (cancelled) return;

        const numPages = pdf.numPages;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          if (cancelled) break;

          const page = await pdf.getPage(pageNum);

          // 👇 base viewport at scale 1
          const baseViewport = page.getViewport({ scale: 1 });

          // 👇 fit width to container (mobile friendly)
          const containerWidth = container.clientWidth || baseViewport.width;
          const scale = containerWidth / baseViewport.width;

          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d", {
            willReadFrequently: true,
          });

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          // 👇 make canvas responsive in layout
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block"; // remove inline gaps
          canvas.style.margin = "0 auto 1rem"; // small gap between pages

          container.appendChild(canvas);

          const renderTask = page.render({
            canvasContext: context,
            viewport,
          });

          renderTasks.push(renderTask);

          try {
            await renderTask.promise;
          } catch (err) {
            if (!cancelled) console.error("PDF render error:", err);
          }
        }
      })
      .catch((err) => {
        if (!cancelled) console.error("PDF load error:", err);
      });

    return () => {
      cancelled = true;

      for (const rt of renderTasks) {
        try {
          if (rt && typeof rt.cancel === "function") rt.cancel();
        } catch {
          // ignore
        }
      }

      try {
        loadingTask.destroy();
      } catch {
        // ignore
      }
    };
  }, [pdfData]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto bg-gray-100"
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
