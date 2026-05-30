import { RobotsTxtGenerator } from "@/components/features/robots-txt-generator";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Robots.txt Generator | Devmint",
  description: "Generate robots.txt files for your website with a visual rule builder",
  path: "/tools/robots-txt",
  keywords: ["robots.txt generator", "seo robots", "robotstxt"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="Robots.txt Generator"
      description="Generate robots.txt files for your website with a visual rule builder"
      breadcrumbs={{ title: "Robots.txt Generator" }}
    >
      <RobotsTxtGenerator />
    </ToolPageLayout>
  );
}
