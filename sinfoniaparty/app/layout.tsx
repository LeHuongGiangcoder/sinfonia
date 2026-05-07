import type { Metadata } from "next";
import { montserrat, playfair, purgatory } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sinfonia.party"), // Replace with your actual domain
  title: "The Sunset Sinfonia",
  description: "An exclusive event for the wedding industry in Vietnam.",
  openGraph: {
    title: "The Sunset Sinfonia",
    description: "An exclusive event for the wedding industry in Vietnam.",
    images: [
      {
        url: "/assets/hero%20background.png",
        width: 1672,
        height: 941,
        alt: "The Sunset Sinfonia Hero Background",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Sunset Sinfonia",
    description: "An exclusive event for the wedding industry in Vietnam.",
    images: ["/assets/hero%20background.png"],
  },
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
      <body className="min-h-full flex flex-col font-sans text-foreground bg-background" suppressHydrationWarning>
        {/* Cinematic Grain Overlay */}
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
