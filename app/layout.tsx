import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frontend Developer Portfolio",
  description: "Creating beautiful, responsive web experiences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}