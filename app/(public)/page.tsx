import {
  Achievements,
  Gallery,
  Hero,
  Highlights,
  Initiatives,
  Testimonials,
} from "@/components/routes/home";

export async function generateMetadata() {
  return {
    title: "Home",
    description:
      "Join Nanogram – a student-driven electronics community offering hands-on projects, workshops, and real-world industry exposure. Learn, build, and innovate.",
  };
}

export default function Home() {
  return (
    <>
      <Hero />
      <Initiatives />
      <Highlights />
      <Gallery />
      <Achievements />
      <Testimonials />
    </>
  );
}
