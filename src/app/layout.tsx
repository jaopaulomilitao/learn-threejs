import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="pt-br">
      <body>
        {children}
      </body>
    </html>
  );
}
