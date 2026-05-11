import type { Metadata } from "next";
import { montserrat, playfair, purgatory } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://thesunsetsinfonia.gloweb.site"),
  title: "The Sunset Sinfonia",
  description: "An exclusive event for the wedding industry in Vietnam.",
  openGraph: {
    title: "The Sunset Sinfonia",
    description: "An exclusive event for the wedding industry in Vietnam.",
    images: [
      {
        url: "https://thesunsetsinfonia.gloweb.site/assets/thumbnail.jpg",
        width: 708,
        height: 944,
        alt: "The Sunset Sinfonia Thumbnail",
      },
    ],
    url: "https://thesunsetsinfonia.gloweb.site",
    siteName: "The Sunset Sinfonia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Sunset Sinfonia",
    description: "An exclusive event for the wedding industry in Vietnam.",
    images: ["https://thesunsetsinfonia.gloweb.site/assets/thumbnail.jpg"],
  },
  robots: "all",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${playfair.variable} ${purgatory.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" href="/assets/Lady Gaga, Bruno Mars - Die With A Smile (Official Music Video).mp3" as="audio" />
      </head>
      <body className="min-h-full flex flex-col font-sans text-foreground bg-background" suppressHydrationWarning>
        {/* Cinematic Grain Overlay */}
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
