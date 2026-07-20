import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import AdminLayout from "../components/AdminLayout";

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "CONSULTax Associates | Admin Dashboard",
  description: "CONSULTax Associates Admin dashboard lead triage and configuration settings panel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cloud text-charcoal">
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
