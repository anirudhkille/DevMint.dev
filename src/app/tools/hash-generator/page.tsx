import { HashGenerator } from "@/components/features/hash-generator";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Hash Generator | DevMint",
  description:
    "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text directly in your browser.",
  path: "/tools/hash-generator",
  keywords: ["hash generator", "md5 generator", "sha256 generator", "sha1 hash", "checksum generator"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text directly in your browser."
      breadcrumbs={{ title: "Hash Generator" }}
    >
      <HashGenerator />
    </ToolPageLayout>
  );
}
