import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./utils/useAuth";

export const metadata: Metadata = {
  title: "MenuMind - AI-Powered Restaurant Experience",
  description:
    "Revolutionize your restaurant with AI-driven menu management and customer engagement.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
