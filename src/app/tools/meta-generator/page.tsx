import { MetaTagGenerator } from "@/components/features/meta-tag-generator";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Meta Tag Generator | Devmint",
  description: "Generate SEO-friendly meta tags and Open Graph tags for your website.",
  path: "/tools/meta-generator",
  keywords: ["meta tags", "seo", "open graph"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="Meta Tag Generator"
      description="Generate SEO-friendly meta tags and Open Graph tags for your website."
      breadcrumbs={{ title: "Meta Tag Generator" }}
    >
      <MetaTagGenerator />
    </ToolPageLayout>
  );
}
