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
  const deviceWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  return (
    <div className={`md:w-${width} w-full`}>
      <Document
        file={url}
        loading={
          <div
            className={`md:w-${width} w-96 md:h-[18.14rem] h-[33.94rem] flex justify-center items-center`}
          >
            <span className="loading loading-bars loading-xl"></span>
          </div>
        }
      >
        <Page
          pageNumber={1}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          width={deviceWidth > 768 ? 4 * width : 384}
        />
      </Document>
    </div>
  );
};

export default PDFPage;
