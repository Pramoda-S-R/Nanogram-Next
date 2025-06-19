"use client";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css"; // For annotations
import "react-pdf/dist/Page/TextLayer.css"; // For text selection

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PDFPage = ({ width, url }: { width: number; url: string }) => {
  return (
    <div className={`w-${width}`}>
      <Document
        file={url}
        loading={
          <div
            className={`w-${width} h-56 flex justify-center items-center`}
          >
            <span className="loading loading-bars loading-xl"></span>
          </div>
        }
      >
        <Page
          pageNumber={1}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          width={4 * width}
        />
      </Document>
    </div>
  );
};

export default PDFPage;
