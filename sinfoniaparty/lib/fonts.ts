import { Montserrat, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";

export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const amsterdam = localFont({
  src: "../public/assets/amsterdam-handwriting/amsterdam.ttf",
  variable: "--font-amsterdam",
});
