import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kotoku — Your pocket, minus the clutter",
  description:
    "Your cards, IDs, and everyday details — organized in one convenient digital wallet.",
    icons: {
    icon: "/favicon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className ={`${manrope.variable} antialiased font-sans`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}