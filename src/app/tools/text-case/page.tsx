import { TextCaseConverter } from "@/components/features/text-case-converter";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Text Case Converter | Devmint",
  description: "Convert text between different case formats instantly",
  path: "/tools/text-case",
  keywords: ["text case converter"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="Text Case Converter"
      description="Convert text between different case formats instantly"
      breadcrumbs={{ title: "Text Case Converter" }}
    >
      <TextCaseConverter />
    </ToolPageLayout>
  );
}
