"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { toolNavigation } from "@/config/site";
import { Logo } from "@/components/logo";

interface NavItem {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface MobileSidebarNavItemProps {
  item: NavItem;
  onNavigate: () => void;
}

function MobileSidebarNavItem({ item, onNavigate }: MobileSidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = item.href ? pathname === item.href : false;

  const Icon = item.icon;

  return (
    <Link
      href={item.href || "#"}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
        isActive
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{item.title}</span>
    </Link>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 pr-0">
        <div className="mt-3 flex items-center gap-2 border-b px-2 pb-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-sm border">
            <Logo className="h-6 w-6" />
          </div>
          <span className="font-semibold">DevMint</span>
        </div>
        <nav className="mt-4 h-[calc(100vh-8rem)] space-y-2 overflow-y-auto pr-4">
          {toolNavigation.map((item) => (
            <MobileSidebarNavItem key={item.title} item={item} onNavigate={() => setOpen(false)} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
