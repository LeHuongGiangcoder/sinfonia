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

export const purgatory = localFont({
  src: "../public/assets/purgatory/Purgatory.ttf",
  variable: "--font-purgatory",
  display: "block",
});
