import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AFM Chegutu Town Assembly",
  description: "Apostolic Faith Mission · Chegutu Town Assembly · Zimbabwe — A family of believers dedicated to the apostolic doctrine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
