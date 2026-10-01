import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
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
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto px-[32px] md:px-[64px] py-8 relative animate-page">
                {children}
              </main>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
