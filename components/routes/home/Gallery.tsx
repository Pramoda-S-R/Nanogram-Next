import React from "react";
import ShuffleGallery from "@/components/client/ShuffleGallery";
import { images } from "@/constants";
import Button from "@/components/client/shared/Button";

const Gallery = () => {
  return (
    <section className="w-full flex md:flex-row flex-col gap-5 md:px-20 px-4">
      <div className="w-full h-full">
        <ShuffleGallery images={images} />
      </div>
      <div className="w-full flex flex-col justify-center">
        <div className="flex flex-col gap-5 py-6">
          <h1 className="text-5xl font-medium mb-4">Glimpse of Nanogram</h1>
          <p className="px-4">
            A collection of photos from past activities at Nanogram
          </p>
          <Button navigateTo="/gallery" className="btn btn-secondary w-fit">
            Vist the Gallery
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
