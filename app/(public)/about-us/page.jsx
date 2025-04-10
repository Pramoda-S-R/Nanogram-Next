import {
  Activities,
  Alumini,
  Contact,
  Mission,
  Team,
  Unique,
} from "@/components/routes/AboutUs";
import React from "react";

const AboutUs = () => {
  return (
    <div className="h-screen">
      <Mission />
      <Unique />
      <Team />
      <Alumini />
      <Activities />
      <Contact />
    </div>
  );
};

export default AboutUs;
