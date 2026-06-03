import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Win Booth — The Sunset Sinfonia",
  description: "Capture and share your moments at The Sunset Sinfonia photo booth.",
};

export default function WinBoothPage() {
  return (
    <main style={{ width: "100vw", height: "100dvh", overflow: "hidden", position: "relative" }}>
      <iframe
        src="https://fotoshare.co/e/bBAx_UjA2Vx4YM68A4DKY"
        title="Win Booth — FotoShare"
        allow="camera; microphone; fullscreen; autoplay"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </main>
  );
}
