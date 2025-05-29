import Hero from "@/components/routes/home/Hero";

export async function generateMetadata() {
  return {
    title: "Nanogram",
    keywords: ["Nanogram"],
    description:
      "Nanogram is a modern, open-source social media platform built with Next.js and MongoDB.",
    openGraph: {
      images: [
        {
          url: `https://your-app.vercel.app/api/og?title=${encodeURIComponent(
            "Nanogram"
          )}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function Home() {
  return (
    <>
      <Hero />
    </>
  );
}
