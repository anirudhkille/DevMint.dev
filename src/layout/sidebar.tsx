"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Code, Home, Image, ToolCase } from "lucide-react";

interface NavItem {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: NavItem[];
}

const navigation: NavItem[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "All Tools", href: "/tools", icon: ToolCase },
  { title: "Image Compressor", href: "/tools/compressor", icon: Image },
  { title: "Meta Tag Generator", href: "/tools/meta-generator", icon: Code },
];

interface SidebarNavItemProps {
  item: NavItem;
  level?: number;
}

function SidebarNavItem({ item, level = 0 }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = item.href ? pathname === item.href : false;

  const Icon = item.icon;

  return (
    <Link
      href={item.href || "#"}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
        isActive
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        level > 0 && !Icon && "pl-2"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{item.title}</span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="border-border fixed top-14 left-0 z-30 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r md:sticky md:block">
      <div className="h-full py-6 pr-4 pl-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <SidebarNavItem key={item.title} item={item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
