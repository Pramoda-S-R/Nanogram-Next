import {
  Mission,
  Unique,
  Team,
  Alumini,
  Activities,
  Contact,
} from "@/components/routes/about";

export const generateMetadata = () => {
  return {
    title: "About Us | Nanogram",
    description: "Learn about Nanogram, our mission, team, and activities.",
  };
};

const AboutUs = () => {
  return (
    <>
      <Mission />
      <Unique />
      <Team />
      <Alumini />
      <Activities />
      <Contact />
    </>
  );
};

export default AboutUs;
