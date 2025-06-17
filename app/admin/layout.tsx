import Navbar from "@/components/server/Navbar";
import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}
