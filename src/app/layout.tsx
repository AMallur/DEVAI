import type { Metadata } from "next";
import "./globals.css";
import "./site.css";

export const metadata: Metadata = {
  title: "Aeryn — home base for GoState, FableAgent, GAIA & RecallDock",
  description: "Aeryn is the single hub every product ships from — GoState, FableAgent, GAIA, RecallDock, and everything that follows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
