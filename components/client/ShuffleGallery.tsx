"use client";

import { motion } from "framer-motion";
import React, { JSX, useEffect, useRef, useState } from "react";

const shuffle = (array: any[]) => {
  let currentIndex = array.length, randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const generateSquares = (squareData: { id: number; src: string }[]) => {
  return shuffle([...squareData]).map((sq: { id: number; src: string }) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
      }}
    />
  ));
};

const ShuffleGallery = ({ images }: { images: string[] }) => {
  const squareData = images.map((url, index) => ({
    id: index + 1,
    src: url,
  }));

  const [squares, setSquares] = useState<JSX.Element[] | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const shuffleSquares = () => {
      setSquares(generateSquares(squareData));
      timeoutRef.current = setTimeout(shuffleSquares, 3000);
    };

    shuffleSquares();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!squares) return null; // Prevent mismatch during initial SSR render

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
      {squares}
    </div>
  );
};

export default ShuffleGallery;
