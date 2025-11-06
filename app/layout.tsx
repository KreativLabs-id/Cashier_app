import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kasir Martabak & Terang Bulan",
  description: "Aplikasi kasir untuk Martabak & Terang Bulan Oom",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#f97316",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kasir Martabak",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
