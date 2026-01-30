import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Hello 👋 I'm Tom - Full-Stack Developer",
  description: "Creating beautiful, responsive web experiences",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}