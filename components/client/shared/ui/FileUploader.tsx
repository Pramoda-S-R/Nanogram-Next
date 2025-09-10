"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { UploadedFile } from "@/types";
import Image from "next/image";

const FileUploader = ({
  onFileChange,
  imageStyles = "h-fit w-1/2 rounded-[8px]",
  initialFileUrl = "",
  acceptedFileTypes = { "*": ["*"] },
  enableImageCropping = false,
  cropAspectRatio = 1,
  cropperStyle = { height: 400, width: "100%" },
}: UploadedFile) => {
  const [fileUrl, setFileUrl] = useState<string>(initialFileUrl);
  const [cropping, setCropping] = useState<boolean>(false);
  const cropperRef = useRef<ReactCropperElement>(null);

  useEffect(() => {
    if (initialFileUrl) {
      setFileUrl(initialFileUrl);
    }
  }, [initialFileUrl]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const newFileUrl = URL.createObjectURL(file);
        setFileUrl(newFileUrl);
        if (enableImageCropping && file.type.startsWith("image/")) {
          setCropping(true);
        } else {
          onFileChange(file);
        }
      }
    },
    [enableImageCropping, onFileChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
  });

  const cropImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const cropper = cropperRef.current;
    if (!cropper || !cropper.cropper) return;

    cropper.cropper.getCroppedCanvas().toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "cropped-image.jpg", {
            type: blob.type,
          });
          const croppedFileUrl = URL.createObjectURL(file);
          setFileUrl(croppedFileUrl);
          setCropping(false);
          onFileChange(file);
        }
      },
      "image/jpeg",
      1
    );
  };

  const cancelCrop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setFileUrl("");
    setCropping(false);
    onFileChange(null);
  };

  return (
    <div className="flex justify-center">
      {cropping ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Cropper
            src={fileUrl}
            style={cropperStyle}
            aspectRatio={cropAspectRatio}
            guides={false}
            ref={cropperRef}
            viewMode={1}
            className="h-3/4"
          />
          <div className="flex justify-center items-center gap-5 my-5">
            <button
              type="button"
              className="btn btn-primary"
              onClick={cropImage}
            >
              Crop and Save
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={cancelCrop}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="flex-center flex-col bg-accent-gray rounded-xl cursor-pointer"
        >
          <input {...getInputProps()} className="hidden" />
          {fileUrl ? (
            <>
              <div
                className="flex flex-1 justify-center w-full p-2 lg:p-4"
                onClick={(e) => e.stopPropagation()}
              >
                {enableImageCropping ? (
                  <div className={`relative ${imageStyles}`}>
                    <Image
                      fill
                      src={fileUrl}
                      alt="Uploaded file"
                      className="object-cover object-top pointer-events-none"
                      priority
                    />
                  </div>
                ) : (
                  <p className="w-full text-center p-4 border-t border-t-neutral">
                    File uploaded successfully {fileUrl}
                  </p>
                )}
              </div>
              <p
                className="w-full text-center p-4 border-t border-t-neutral"
                onClick={(e) => e.stopPropagation()}
              >
                Click or drag files here to replace
              </p>
            </>
          ) : (
            <div
              className="flex items-center justify-center flex-col p-7 h-44 text-center text-base-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-md mt-2">Drag files here</h3>
              <p className="text-sm mt-2 mb-3">
                {Object.values(acceptedFileTypes).flat().join(", ")}
              </p>
              <p className="btn btn-outline">Select from device</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
