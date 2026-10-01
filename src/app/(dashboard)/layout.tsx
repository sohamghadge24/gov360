import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-[32px] md:px-[64px] py-8 relative animate-page">
          {children}
        </main>
      </div>
    </>
  );
}
