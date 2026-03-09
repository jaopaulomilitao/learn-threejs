import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

// configures inter font with all weights
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// configures dm sans font with all weights
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Learn Three.js",
  description: "Plataforma de ensino de Computação Gráfica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // injects the css variables into the html tag
    <html lang="pt-BR" className={`${inter.variable} ${dmSans.variable} ${GeistSans.variable}`}>
      <body className="font-sans antialiased bg-main-white text-main-black">
        {children}
      </body>
    </html>
  );
}