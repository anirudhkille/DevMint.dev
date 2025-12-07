import ImageCompressor from "@/components/features/image-compressor";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Image Compressor | Devmint",
  description: "Compress PNG, JPG, and WebP images instantly with adjustable quality.",
  path: "/tools/image-compressor",
  keywords: ["image compressor", "compress jpg", "compress png"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="Image Compressor"
      description="Compress PNG, JPG, and WebP images instantly with adjustable quality."
      breadcrumbs={{ title: "Image Compressor" }}
    >
      <ImageCompressor />
    </ToolPageLayout>
  );
}
