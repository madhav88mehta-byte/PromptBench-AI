import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptBench AI",
  description: "An experimental platform for evaluating AI-assisted software development.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
