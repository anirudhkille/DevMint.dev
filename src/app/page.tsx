import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubIcon, ArrowRightIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { tools } from "@/config/site";

export default function HomePage() {
  return (
    <>
      <div className="relative flex h-140 w-full items-center justify-center bg-white px-5 dark:bg-black">
        <div
          className={cn(
            "absolute inset-0",
            "bg-size-[40px_40px]",
            "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
        <div className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="border-border/50 bg-muted/50 text-muted-foreground animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Free and Open Source</span>
            </div>

            <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
              <span>Essential Tools</span>
              <br />
              <span className="from-primary to-accent bg-linear-to-b bg-clip-text text-transparent">
                for Developers
              </span>
            </h1>

            <p className="text-muted-foreground animate-fade-in-up animation-delay-200 mt-6 text-lg text-pretty md:text-xl">
              Fast, simple, and powerful utilities for everyday development.
              <br className="hidden sm:block" />
              No sign-up required. Just open and use.
            </p>

            <div className="animate-fade-in-up animation-delay-400 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="group relative overflow-hidden px-8">
                <Link href="/tools">
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="bg-transparent backdrop-blur-sm"
              >
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="animate-fade-in-up mb-12 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Available Tools</h2>
            <p className="text-muted-foreground mt-2">Pick a tool and start working in seconds</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {tools.map((tool, index) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <Card className="border-border/50 bg-card/50 hover:border-border hover:bg-card/80 hover:shadow-foreground/5 relative h-full overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div
                    className={`absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />
                  <CardHeader className="relative">
                    <div className="bg-foreground/10 group-hover:bg-foreground/20 mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                      <tool.icon className="text-foreground h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {tool.description}
                    </CardDescription>
                    <div className="text-foreground mt-4 flex items-center text-sm font-medium">
                      Open tool
                      <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
