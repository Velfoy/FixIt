import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import Providers from "@/components/layouts/Providers";

export const metadata: Metadata = {
  title: "AutoService - Система управления автосервисом",
  description:
    "Профессиональная система управления автосервисом с видеоотчётами",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
