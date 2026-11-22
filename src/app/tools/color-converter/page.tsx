import { ColorConverter } from "@/components/features/color-converter";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Color Converter & Contrast Checker | DevMint",
  description:
    "Convert colors between HEX, RGB, and HSL and check WCAG contrast ratios in your browser.",
  path: "/tools/color-converter",
  keywords: [
    "color converter",
    "hex to rgb",
    "rgb to hsl",
    "contrast checker",
    "wcag contrast",
  ],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="Color Converter & Contrast Checker"
      description="Convert colors between HEX, RGB, and HSL and check WCAG contrast ratios in your browser."
      breadcrumbs={{ title: "Color Converter" }}
    >
      <ColorConverter />
    </ToolPageLayout>
  );
}
