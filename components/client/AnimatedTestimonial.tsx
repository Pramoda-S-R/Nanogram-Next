"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Testimonial } from "@/types";

export default function AnimatedTestimonial({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000); // Auto-play every 5 seconds
    return () => clearInterval(timer);
  }, [testimonials]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + testimonials.length) % testimonials.length
      );
    } else if (info.offset.x < -100) {
      nextTestimonial();
    }
    controls.start({ x: 0 });
  };

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 300 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-neutral-white shadow-xl rounded-lg p-8 cursor-grab active:cursor-grabbing"
        >
          <TestimonialDiv testimonial={testimonials[currentIndex]} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {testimonials.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-primary" : "bg-accent-gray"
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
        className="w-24 h-24 rounded-full border border-neutral-black/10 object-cover mx-auto"
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
        className="text-neutral-black/70 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {testimonial?.role}
      </motion.p>
      <motion.blockquote
        className="text-lg italic text-neutral-black"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
      >
        "{testimonial?.content}"
      </motion.blockquote>
    </div>
  );
}
