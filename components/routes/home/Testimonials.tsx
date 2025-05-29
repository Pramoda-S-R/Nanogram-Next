import React from "react";
import { getTestimonials } from "@/api";
import AnimatedTestimonial from "@/components/client/AnimatedTestimonial";

export default async function Testimonials() {
  const testimonials = await getTestimonials();

  return (
    <div className="relative w-full px-4 lg:pt-20 md:pt-32 pt-52 py-16 overflow-hidden">
      <div className="max-w-4xl mx-auto">
         <AnimatedTestimonial testimonials={testimonials} />
      </div>
    </div>
  );
}