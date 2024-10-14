import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';

// Importando a fonte Inter com todos os pesos
const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Learn Three.js",
  description: "A blog where teachers can create and update documents about CGI using Three.js, and students can learn in a practical and organized way.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={inter.className}>
      <body className="bg-main-white text-main-black">
        {children}
      </body>
    </html>
  );
}
