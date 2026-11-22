import { JwtDecoder } from "@/components/features/jwt-decoder";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "JWT Decoder | DevMint",
  description:
    "Decode JSON Web Token headers, payloads, and claims in your browser. Inspect expiration without sending tokens anywhere.",
  path: "/tools/jwt-decoder",
  keywords: ["jwt decoder", "json web token", "jwt parser", "decode jwt"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="JWT Decoder"
      description="Decode JSON Web Token headers, payloads, and claims in your browser. Inspect expiration without sending tokens anywhere."
      breadcrumbs={{ title: "JWT Decoder" }}
    >
      <JwtDecoder />
    </ToolPageLayout>
  );
}
