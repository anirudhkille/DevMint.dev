"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckIcon,
  CopyIcon,
  MinimizeIcon,
  WandIcon,
  AlertCircleIcon,
  FileCodeIcon,
} from "lucide-react";

function minifyHTML(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+(<[^/])/g, "$1")
    .replace(/(>)\s+/g, "$1")
    .replace(/^(\s*[\r\n])+/gm, "")
    .trim();
}

function formatHTML(html: string): string {
  const clean = html.replace(/<!--[\s\S]*?-->/g, "").trim();
  const tags = clean
    .replace(/>\s*</g, ">\n<")
    .split("\n")
    .filter((l) => l.trim());
  let indent = 0;
  const result: string[] = [];

  for (let line of tags) {
    const stripped = line.trim();
    const isClosing = stripped.startsWith("</");
    const isSelfClosing = stripped.endsWith("/>") || stripped.endsWith("</") || stripped.startsWith("<!") || stripped.startsWith("<?");
    const isComment = stripped.startsWith("<!--");

    if (isClosing && !isSelfClosing && !isComment) {
      indent = Math.max(0, indent - 1);
    }

    result.push("  ".repeat(indent) + stripped);

    if (!isClosing && !isSelfClosing && !isComment && !stripped.endsWith("/>") && !stripped.startsWith("</")) {
      indent++;
    }
  }

  return result.join("\n");
}

export function HtmlMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleMinify = () => {
    try {
      setOutput(minifyHTML(input));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const handleFormat = () => {
    try {
      setOutput(formatHTML(input));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Input HTML</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your HTML here..."
            className="min-h-[400px] font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleMinify} className="gap-2">
              <MinimizeIcon className="h-4 w-4" />
              Minify
            </Button>
            <Button onClick={handleFormat} variant="secondary" className="gap-2">
              <WandIcon className="h-4 w-4" />
              Format
            </Button>
            <Button onClick={clearAll} variant="outline">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Output</CardTitle>
          {output && !error && (
            <Button onClick={copyOutput} variant="ghost" size="sm" className="gap-2">
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="border-destructive/50 bg-destructive/10 flex items-start gap-3 rounded-lg border p-4">
              <AlertCircleIcon className="text-destructive mt-0.5 h-5 w-5" />
              <div>
                <p className="text-destructive font-medium">Error</p>
                <p className="text-muted-foreground mt-1 text-sm">{error}</p>
              </div>
            </div>
          ) : (
            <Textarea
              readOnly
              placeholder="Output will appear here..."
              className="min-h-[400px] font-mono text-sm"
              value={output}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
