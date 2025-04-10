import Navbar from "@/components/shared/Navbar";
import "./globals.css";
import Sidebar from "@/components/shared/Sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <section className="flex flex-1">
          <Sidebar />
          {children}
        </section>
      </body>
    </html>
  );
}
