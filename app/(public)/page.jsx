import {
  Achievements,
  Gallery,
  Hero,
  Highlights,
  Initiatives,
  Testimonials,
} from "@/components/routes/Home";
import React from "react";

const Home = () => {
  return (
    <div className="h-screen">
      <Hero />
      <Initiatives />
      <Highlights />
      <Gallery />
      <Achievements />
      <Testimonials />
    </div>
  );
};

export default Home;
