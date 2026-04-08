import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PwaInitializer } from "@/components/pwa-initializer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PATHY — Reservas para guías de aventura",
  description: "Crea tu página de reservas en 2 minutos. Tus clientes eligen actividad, fecha y reservan. Sin WhatsApps. Sin Bizums.",
  manifest: "/manifest.ts",
};

export const viewport: Viewport = {
  themeColor: "#5B8C5A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans`}>
        <PwaInitializer />
        {children}
      </body>
    </html>
  );
}
