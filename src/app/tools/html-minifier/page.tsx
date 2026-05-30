import { HtmlMinifier } from "@/components/features/html-minifier";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "HTML Minifier | Devmint",
  description: "Minify and format HTML code instantly in your browser",
  path: "/tools/html-minifier",
  keywords: ["html minifier", "html formatter", "html compressor"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="HTML Minifier"
      description="Minify and format HTML code instantly in your browser"
      breadcrumbs={{ title: "HTML Minifier" }}
    >
      <HtmlMinifier />
    </ToolPageLayout>
  );
}
