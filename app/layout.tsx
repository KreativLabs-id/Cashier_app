import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Martabak & Terang Bulan Tip Top",
  description: "Aplikasi manajemen penjualan untuk Martabak & Terang Bulan Tip Top",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#f97316",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tip Top POS",
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
