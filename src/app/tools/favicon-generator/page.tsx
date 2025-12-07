import { FaviconGenerator } from "@/components/features/favicon-generator";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Favicon Generator | Devmint",
  description: "Upload a PNG image and generate all favicon sizes with HTML link tags",
  path: "/tools/gradient-generator",
  keywords: ["favicon generator"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="Favicon Generator"
      description="Upload a PNG image and generate all favicon sizes with HTML link tags"
      breadcrumbs={{ title: "Favicon Generator" }}
    >
      <FaviconGenerator />
    </ToolPageLayout>
  );
}
