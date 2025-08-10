import React, { Suspense } from "react";
import { getTestimonials } from "@/app/actions/api";
import AnimatedTestimonial from "@/components/client/AnimatedTestimonial";

export default async function Testimonials() {
  const testimonials = await getTestimonials();

  return (
    <section
      aria-label="Testimonials"
      className="relative w-full px-4 lg:pt-20 md:pt-32 pt-52 py-16 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<div className="w-full h-full skeleton" />}>
          <AnimatedTestimonial testimonials={testimonials} />
        </Suspense>
      </div>
    </section>
  );
}
