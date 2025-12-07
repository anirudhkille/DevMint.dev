import {
  Home,
  ImageIcon,
  CodeIcon,
  WrenchIcon,
  Braces,
  Palette,
  ImagePlus,
  SwatchBook,
  QrCode,
  CaseSensitive,
} from "lucide-react";

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
  {
    title: "CSS Gradient Generator",
    description:
      "Create beautiful linear, radial, and conic gradients with live preview. Copy CSS code instantly.",
    icon: Palette,
    href: "/tools/gradient-generator",
  },
  {
    title: "Favicon Generator",
    description:
      "Upload a PNG and generate all favicon sizes from 16x16 to 512x512. Download as ZIP with HTML tags.",
    icon: ImagePlus,
    href: "/tools/favicon-generator",
  },
  {
    title: "Color Palette Generator",
    description:
      "Generate random color palettes or extract colors from images. Export as HEX, RGB, or JSON.",
    icon: SwatchBook,
    href: "/tools/color-palette",
  },
  {
    title: "QR Code Generator",
    description:
      "Generate QR codes for URLs, text, or any data. Customize size and download as PNG.",
    icon: QrCode,
    href: "/tools/qr-code",
  },
  {
    title: "Text Case Converter",
    description: "Convert text between camelCase, PascalCase, snake_case, kebab-case, and more.",
    icon: CaseSensitive,
    href: "/tools/text-case",
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
