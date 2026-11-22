import { UuidGenerator } from "@/components/features/uuid-generator";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "UUID Generator | DevMint",
  description:
    "Generate random UUID v4 identifiers in bulk in your browser, with uppercase and hyphen-free options.",
  path: "/tools/uuid-generator",
  keywords: ["uuid generator", "uuid v4", "guid generator", "random uuid"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="UUID Generator"
      description="Generate random UUID v4 identifiers in bulk in your browser, with uppercase and hyphen-free options."
      breadcrumbs={{ title: "UUID Generator" }}
    >
      <UuidGenerator />
    </ToolPageLayout>
  );
}
