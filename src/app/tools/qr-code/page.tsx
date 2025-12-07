import { QrCodeGenerator } from "@/components/features/qr-code-generator";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "QR Code Generator | Devmint",
  description: "Generate QR codes for URLs, text, or any data instantly",
  path: "/tools/qr-code",
  keywords: ["qr code generator"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="QR Code Generator"
      description="Generate QR codes for URLs, text, or any data instantly"
      breadcrumbs={{ title: "QR Code Generator" }}
    >
      <QrCodeGenerator />
    </ToolPageLayout>
  );
}
