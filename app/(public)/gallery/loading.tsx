import React from "react";

const GalleryLoader = () => {
  return (
    <div className="w-full h-dvh flex justify-center">
      <div className="h-96 w-full skeleton"></div>
      <span className="loading loading-infinity"></span>
    </div>
  );
};

export default GalleryLoader;
