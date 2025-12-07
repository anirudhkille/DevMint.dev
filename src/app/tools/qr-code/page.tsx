import { ColorPaletteGenerator } from "@/components/features/color-palette";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Color Palette Generator | Devmint",
  description: "Generate random palettes or extract colors from images",
  path: "/tools/color-palette",
  keywords: ["color palette"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="Color Palette Generator"
      description="Generate random palettes or extract colors from images"
      breadcrumbs={{ title: "Color Palette Generator" }}
    >
      <ColorPaletteGenerator />
    </ToolPageLayout>
  );
}
