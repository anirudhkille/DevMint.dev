"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyIcon, CheckIcon } from "lucide-react";

export default function MetaTagGenerator() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generatedCode = useMemo(() => {
    const lines: string[] = [];

    if (formData.title) {
      lines.push(`<title>${formData.title}</title>`);
    }

    if (formData.description) {
      lines.push(`<meta name="description" content="${formData.description}" />`);
    }

    if (formData.keywords) {
      lines.push(`<meta name="keywords" content="${formData.keywords}" />`);
    }

    if (formData.ogTitle || formData.title) {
      lines.push(`<meta property="og:title" content="${formData.ogTitle || formData.title}" />`);
    }

    if (formData.ogDescription || formData.description) {
      lines.push(
        `<meta property="og:description" content="${formData.ogDescription || formData.description}" />`
      );
    }

    if (formData.ogImage) {
      lines.push(`<meta property="og:image" content="${formData.ogImage}" />`);
    }

    if (formData.ogTitle || formData.title) {
      lines.push(`<meta property="og:type" content="website" />`);
      lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
      lines.push(`<meta name="twitter:title" content="${formData.ogTitle || formData.title}" />`);
      if (formData.ogDescription || formData.description) {
        lines.push(
          `<meta name="twitter:description" content="${formData.ogDescription || formData.description}" />`
        );
      }
      if (formData.ogImage) {
        lines.push(`<meta name="twitter:image" content="${formData.ogImage}" />`);
      }
    }

    return lines.join("\n");
  }, [formData]);

  const copyToClipboard = async () => {
    if (!generatedCode) return;
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tag Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="My Awesome Website"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="A brief description of your page content..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              name="keywords"
              placeholder="web, development, tools"
              value={formData.keywords}
              onChange={handleChange}
            />
            <p className="text-muted-foreground text-xs">Separate keywords with commas</p>
          </div>

          <div className="border-border border-t pt-4">
            <p className="text-muted-foreground mb-4 text-sm font-medium">
              Open Graph (Social Media)
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ogTitle">OG Title</Label>
                <Input
                  id="ogTitle"
                  name="ogTitle"
                  placeholder="Leave empty to use page title"
                  value={formData.ogTitle}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogDescription">OG Description</Label>
                <Textarea
                  id="ogDescription"
                  name="ogDescription"
                  placeholder="Leave empty to use page description"
                  value={formData.ogDescription}
                  onChange={handleChange}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">OG Image URL</Label>
                <Input
                  id="ogImage"
                  name="ogImage"
                  placeholder="https://example.com/image.jpg"
                  value={formData.ogImage}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Generated Code</CardTitle>
          <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!generatedCode}>
            {copied ? (
              <>
                <CheckIcon className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon className="mr-2 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
              <code className="text-foreground font-mono">
                {generatedCode || (
                  <span className="text-muted-foreground">
                    {"<!-- Fill in the form to generate meta tags -->"}
                  </span>
                )}
              </code>
            </pre>
          </div>

          {generatedCode && (
            <p className="text-muted-foreground mt-4 text-xs">
              Paste this code inside the {"<head>"} section of your HTML document.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
