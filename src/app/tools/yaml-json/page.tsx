import { YamlJsonConverter } from "@/components/features/yaml-json-converter";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "YAML to JSON Converter | DevMint",
  description:
    "Convert YAML to JSON or JSON to YAML instantly in your browser with clear error messages.",
  path: "/tools/yaml-json",
  keywords: ["yaml to json", "json to yaml", "yaml converter", "yaml parser"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="YAML to JSON Converter"
      description="Convert YAML to JSON or JSON to YAML instantly in your browser with clear error messages."
      breadcrumbs={{ title: "YAML to JSON Converter" }}
    >
      <YamlJsonConverter />
    </ToolPageLayout>
  );
}
