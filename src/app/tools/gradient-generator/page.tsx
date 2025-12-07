import { GradientGenerator } from "@/components/features/gradient-generator";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Gradient Generator | Devmint",
  description: "Create beautiful gradients with live preview and copy CSS code",
  path: "/tools/gradient-generator",
  keywords: ["gradient generator", "linear gradient", "radial gradient","conic gradient",],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="Gradient Generator"
      description="Create beautiful gradients with live preview and copy CSS code"
      breadcrumbs={{ title: "Gradient Generator" }}
    >
      <GradientGenerator />
    </ToolPageLayout>
  );
}
