import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReactNode } from "react";

type BreadcrumbItem = {
  title: string;
  href?: string;
};

type ToolPageLayoutProps = {
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem;
  children: ReactNode;
};

export default function ToolPageLayout({
  title,
  description,
  breadcrumbs,
  children,
}: ToolPageLayoutProps) {
  const items: BreadcrumbItem[] = [
    { title: "Home", href: "/" },
    { title: "Tools", href: "/tools" },
  ];

  if (breadcrumbs) items.push(breadcrumbs);

  return (
    <div className="bg-background min-h-screen space-y-10 p-6 md:p-8">
      <Breadcrumbs items={items} />

      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </div>

        {children}
      </div>
    </div>
  );
}
