import Footer from "@/layout/footer";
import { Header } from "@/layout/header";
import { Sidebar } from "@/layout/sidebar";
import * as React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="container flex flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}
