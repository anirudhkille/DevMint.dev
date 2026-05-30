import { BcryptGenerator } from "@/components/features/bcrypt-generator";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Bcrypt Generator | Devmint",
  description: "Generate bcrypt password hashes and verify bcrypt hashes instantly in your browser",
  path: "/tools/bcrypt-generator",
  keywords: ["bcrypt generator", "bcrypt hash", "password hasher"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="Bcrypt Generator"
      description="Generate bcrypt password hashes and verify bcrypt hashes instantly in your browser"
      breadcrumbs={{ title: "Bcrypt Generator" }}
    >
      <BcryptGenerator />
    </ToolPageLayout>
  );
}
