import React, { Suspense } from "react";
import ShuffleGallery from "@/components/client/ShuffleGallery";
import { images } from "@/constants";
import Link from "next/link";

const Gallery = () => {
  return (
    <section className="max-w-7xl mx-auto w-full flex md:flex-row flex-col gap-5 md:px-20 px-4">
      <div className="w-full h-full">
        <Suspense
          fallback={
            <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
              {Array.from({ length: 16 }, (_, i) => (
                <div key={i} className="skeleton w-full h-full" />
              ))}
            </div>
          }
        >
          <ShuffleGallery images={images} />
        </Suspense>
      </div>
      <div className="w-full flex flex-col justify-center">
        <div className="flex flex-col gap-5 py-6">
          <h1 className="text-5xl font-medium mb-4">Glimpse of Nanogram</h1>
          <p className="px-4">
            A collection of photos from past activities at Nanogram
          </p>
          <Link href="/gallery" className="btn btn-secondary w-fit">
            Vist the Gallery
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
