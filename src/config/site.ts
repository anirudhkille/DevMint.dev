import { Home, ImageIcon, CodeIcon, WrenchIcon, Braces } from "lucide-react";

export const navigation = [
  { title: "Home", href: "/", icon: Home },
  { title: "All Tools", href: "/tools", icon: WrenchIcon },
];

export const tools = [
  {
    title: "Image Compressor",
    description: "Compress PNG, JPG, and WebP images with adjustable quality settings.",
    icon: ImageIcon,
    href: "/tools/compressor",
  },
  {
    title: "Meta Tag Generator",
    description: "Generate SEO-friendly meta tags and Open Graph tags for your website.",
    icon: CodeIcon,
    href: "/tools/meta-generator",
  },
  {
    title: "JSON Formatter",
    description: "Format, validate, and minify JSON data instantly.",
    icon: Braces,
    href: "/tools/json-formatter",
  },
];

export const toolNavigation = [
  ...navigation,
  ...tools.map((t) => ({
    title: t.title,
    href: t.href,
    icon: t.icon,
  })),
];
