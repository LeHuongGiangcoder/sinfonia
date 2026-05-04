import type { Metadata } from "next";
import { montserrat, playfair, purgatory } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Sunset Sinfonia",
  description: "An exclusive event for the wedding industry in Vietnam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${playfair.variable} ${purgatory.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-foreground bg-background">
        {/* Cinematic Grain Overlay */}
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
