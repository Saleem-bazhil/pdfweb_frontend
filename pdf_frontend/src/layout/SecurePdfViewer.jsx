// src/components/SecurePdfViewer.jsx
import { useEffect, useRef } from "react";
import {
  GlobalWorkerOptions,
  getDocument,
} from "pdfjs-dist/build/pdf"; // core pdf.js
import pdfWorker from "pdfjs-dist/build/pdf.worker?url"; // worker for Vite
import "pdfjs-dist/web/pdf_viewer.css";

// ✅ Tell pdf.js where the worker is
GlobalWorkerOptions.workerSrc = pdfWorker;

export default function SecurePdfViewer({ pdfData }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!pdfData || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = ""; // clear previous pages

    // ✅ convert ArrayBuffer → Uint8Array
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
          const viewport = page.getViewport({ scale: 1.2 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d", {
            willReadFrequently: true,
          });

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          container.appendChild(canvas);

          // start render and keep reference so we can cancel it on cleanup
          const renderTask = page.render({
            canvasContext: context,
            viewport,
          });

          renderTasks.push(renderTask);

          try {
            await renderTask.promise;
          } catch (err) {
            // rendering can fail if cancelled; only log unexpected errors
            if (!cancelled) console.error("PDF render error:", err);
          }
        }
      })
      .catch((err) => {
        if (!cancelled) console.error("PDF render error:", err);
      });

    return () => {
      cancelled = true;

      // cancel any in-progress page render tasks
      for (const rt of renderTasks) {
        try {
          if (rt && typeof rt.cancel === "function") rt.cancel();
        } catch (e) {
          // ignore cancellation errors
        }
      }

      try {
        loadingTask.destroy();
      } catch (e) {
        // ignore destroy errors when worker already terminated
      }
    };
  }, [pdfData]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto bg-gray-100"
      // mild protection (no right-click)
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
