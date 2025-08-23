"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation, PanInfo } from "framer-motion";
import { Testimonial } from "@/types/mongodb";

export default function AnimatedTestimonial({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const controls = useAnimation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to start or reset the autoplay timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection("left");
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testimonials, startTimer]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      setDirection("right");
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + testimonials.length) % testimonials.length
      );
      startTimer(); // reset timer on user interaction
    } else if (info.offset.x < -100) {
      setDirection("left");
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      startTimer(); // reset timer on user interaction
    } else {
      controls.start({ x: 0 }); // not enough drag, no change
    }
  };

  const variants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "left" ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: "left" | "right") => ({
      x: direction === "left" ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <>
      <AnimatePresence custom={direction} initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="bg-base-300 shadow-xl rounded-lg p-8 cursor-grab active:cursor-grabbing"
        >
          <TestimonialDiv testimonial={testimonials[currentIndex]} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {testimonials.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-primary" : "bg-base-300"
            }`}
          />
        ))}
      </div>
    </>
  );
}

function TestimonialDiv({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.img
        src={testimonial?.avatarUrl || "/assets/images/placeholder.png"}
        alt={testimonial?.name || "Avatar"}
        className="w-24 h-24 rounded-full border border-base-content/10 object-cover mx-auto"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      />
      <motion.h3
        className="text-xl font-semibold mb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {testimonial?.name}
      </motion.h3>
      <motion.p
        className="text-base-content/70 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {testimonial?.role}
      </motion.p>
      <motion.blockquote
        className="text-lg italic text-base-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
      >
        &ldquo;{testimonial?.content}&rdquo;
      </motion.blockquote>
    </div>
  );
}
