import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, CodeIcon } from "lucide-react";
import { generateMetadata } from "@/lib/metadata";
import ToolPageLayout from "@/layout/tool-layout";

const tools = [
  {
    title: "Image Compressor",
    description:
      "Compress PNG, JPG, and WebP images with adjustable quality settings. Reduce file sizes without losing quality.",
    icon: ImageIcon,
    href: "/tools/compressor",
  },
  {
    title: "Meta Tag Generator",
    description:
      "Generate SEO-friendly meta tags and Open Graph tags for your website. Copy and paste ready-to-use HTML.",
    icon: CodeIcon,
    href: "/tools/meta-generator",
  },
];

export const metadata = generateMetadata({
  title: "All Tools | Devmint",
  description: "Choose a tool to get started",
  path: "/tools",
  keywords: ["image compressor", "meta tag genrator", "compress png"],
});

export default function ToolsPage() {
  return (
    <ToolPageLayout title="Developer Tools" description="Choose a tool to get started">
      <div className="grid gap-6 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="hover:bg-accent/50 hover:border-accent-foreground/20 h-full transition-all">
              <CardHeader>
                <div className="bg-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-lg">
                  <tool.icon className="text-primary h-6 w-6" />
                </div>
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription className="text-sm">{tool.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </ToolPageLayout>
  );
}
