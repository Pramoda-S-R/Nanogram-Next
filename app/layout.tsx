import type { Metadata } from "next";
import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    default: "Nanogram",
    template: "%s | Nanogram",
  },
  description:
    "Nanogram is an electronics and tech community empowering students through hands-on projects, workshops, and real-world industry exposure.",
  keywords: [
    "Nanogram",
    "Student Electronics",
    "Tech Community",
    "STEM Learning",
    "Engineering Projects",
    "Workshops",
    "Industry Knowledge"
  ],
  openGraph: {
    title: "Nanogram",
    description:
      "A tech hub for students passionate about electronics and innovation. Learn, build, and grow with real-world experience.",
    type: "website",
    url: "https://nanogram-techhub.vercel.app",
    images: [
      {
        url: "https://nanogram-techhub.vercel.app/assets/images/nanogram_logo-twitter-card.png",
        width: 1200,
        height: 630,
        alt: "Nanogram Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nanogram",
    description:
      "Empowering student innovators in electronics through workshops, projects, and community learning.",
    images: [
      "https://nanogram-techhub.vercel.app/assets/images/nanogram_logo-twitter-card.png",
    ],
  },
  icons: {
    icon: "/favicon.svg",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
