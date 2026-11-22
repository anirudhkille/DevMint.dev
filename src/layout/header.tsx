"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchCommand } from "./search-command";
import { MobileSidebar } from "./mobile-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { GitHubIcon } from "@/components/github-icon";

const emptySubscribe = () => () => {};

export function Header() {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const isMac = React.useSyncExternalStore(
    emptySubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => false
  );

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header className="border-border bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container flex h-14 items-center px-4 md:px-6">
          <MobileSidebar />

          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/" className="flex items-center font-semibold">
              <div className="flex h-10 w-10 items-center justify-center">
                <Logo className="h-10 w-10" />
              </div>
              <span className="hidden md:inline-block">DevMint</span>
            </Link>
          </div>

          <div className="ml-12 flex flex-1 items-center justify-end gap-2">
            <Button
              variant="outline"
              className="bg-muted/50 text-muted-foreground relative h-9 w-full justify-start rounded-md text-sm sm:w-64 md:w-80"
              onClick={() => setSearchOpen(true)}
            >
              <span className="hidden lg:inline-flex">Search tools...</span>
              <span className="inline-flex lg:hidden">Search...</span>
              <kbd className="bg-background pointer-events-none absolute top-1.5 right-1.5 hidden h-6 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
                <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
              </kbd>
            </Button>
            <div className="flex items-center gap-1">
              <ThemeToggle />

              <Button
                variant="ghost"
                size="icon"
                className="hidden h-9 w-9 justify-center md:flex"
                asChild
              >
                <Link
                  href="https://github.com/anirudhkille/devmint.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubIcon className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
