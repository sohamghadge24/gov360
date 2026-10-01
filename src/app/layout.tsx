import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/lib/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: '--font-display' });

export const metadata: Metadata = {
  title: "GovTrack360 Control Room",
  description: "Unified attendance, duty-verification and field-monitoring platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jakarta.variable} font-sans bg-[var(--color-bg-app)] text-[var(--color-text-main)] overflow-hidden h-screen flex`}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
