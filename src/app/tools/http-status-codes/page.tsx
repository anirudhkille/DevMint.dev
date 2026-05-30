import { HttpStatusCodes } from "@/components/features/http-status-codes";
import ToolPageLayout from "@/layout/tool-layout";
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "HTTP Status Codes Reference | Devmint",
  description: "Searchable reference table of all HTTP status codes with descriptions",
  path: "/tools/http-status-codes",
  keywords: ["http status codes", "status code reference", "http reference"],
});

export default function Page() {
  return (
    <ToolPageLayout
      title="HTTP Status Codes Reference"
      description="Searchable reference table of all HTTP status codes with descriptions"
      breadcrumbs={{ title: "HTTP Status Codes" }}
    >
      <HttpStatusCodes />
    </ToolPageLayout>
  );
}
