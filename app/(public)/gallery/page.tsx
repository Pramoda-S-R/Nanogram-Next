"use client";
import React, { useEffect, useState } from "react";
import { getGalleryResources } from "@/app/actions/api";
import { useInView } from "react-intersection-observer";
import { useIsMouseAvailable } from "@/hooks/useIsMouseAvailable";
import MouseImageTrail from "@/components/client/MouseImageTrail";
import Masonry from "react-masonry-css";
import { images as galleryImages } from "@/constants";
import "@/styles/waterfall.css";

const GalleryPage = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { ref, inView } = useInView();
  const isMouseAvailable = useIsMouseAvailable();

  const breakpointColumnsObj = {
    default: 4, // Number of columns at full screen
    1100: 3, // 3 columns at 1100px
    700: 2, // 2 columns at 700px
    500: 1, // 1 column at 500px
  };

  async function fetchNextPage({
    cursor,
    maxResults,
  }: {
    cursor?: string;
    maxResults?: number;
  }) {
    const resource = await getGalleryResources({ cursor, maxResults });
    setImages((prevImages) => [...prevImages, ...resource.resources]);
    setCursor(resource.next_cursor);
  }

  useEffect(() => {
    if (inView && !loading && cursor !== null) {
      setLoading(true);
      fetchNextPage({ cursor, maxResults: 10 }).finally(() => {
        setLoading(false);
      });
    }
  }, [inView]);

  return (
    <div className="min-h-dvh sm:p-0 pl-2">
      {isMouseAvailable && (
        <MouseImageTrail
          renderImageBuffer={50}
          rotationRange={25}
          images={galleryImages}
        >
          <div className="grid h-96 w-full place-content-center bg-base-100">
            <p className="flex items-center gap-2 text-7xl font-bold uppercase text-base-content">
              <span>The Motion Mosaic</span>
            </p>
          </div>
        </MouseImageTrail>
      )}
      <div className="max-w-7xl mx-auto">
        {images.length !== 0 ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid pt-3"
            columnClassName="my-masonry-grid_column"
          >
            {images.map((image, index) => (
              <div className="waterfall-item" key={index}>
                <img
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  className="px-2 md:px-0"
                />
              </div>
            ))}
          </Masonry>
        ) : (
          <div className="flex w-full justify-center my-20">
            {!loading && (
              <span className="loading loading-infinity loading-xl"></span>
            )}
          </div>
        )}
        <div ref={ref}>
          {loading && (
            <div className="flex w-full justify-center my-10">
              <span className="loading loading-infinity loading-lg"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
