import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hello 👋 I'm Tom - Full-Stack Developer",
  description: "Creating beautiful, responsive web experiences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}