import { Base64Encoder } from "@/components/features/base64-encoder";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Base64 Encoder / Decoder | Devmint",
  description: "Encode text to Base64 or decode Base64 strings instantly in your browser",
  path: "/tools/base64",
  keywords: ["base64 encoder", "base64 decoder", "base64 converter"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="Base64 Encoder / Decoder"
      description="Encode text to Base64 or decode Base64 strings instantly in your browser"
      breadcrumbs={{ title: "Base64 Encoder / Decoder" }}
    >
      <Base64Encoder />
    </ToolPageLayout>
  );
}
