import { JsonFormatter } from "@/components/features/json-formatter";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "JSON Formatter | Devmint",
  description: "Format, validate, and minify your JSON data instantly",
  path: "/tools/json-formatter",
  keywords: ["json formatter", "minify json", "validate json"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="JSON Formatter"
      description="Format, validate, and minify your JSON data instantly"
      breadcrumbs={{ title: "JSON Formatter" }}
    >
      <JsonFormatter />
    </ToolPageLayout>
  );
}
