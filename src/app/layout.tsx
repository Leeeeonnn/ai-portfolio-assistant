import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leon’s Portfolio",
  description:
    "An AI portfolio assistant for interviewers, recruiters, and collaborators.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
