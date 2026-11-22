"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckIcon, CopyIcon, MinimizeIcon, WandIcon } from "lucide-react";

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function preserveBlocks(html: string) {
  const blocks: string[] = [];
  const result = html.replace(
    /<(pre|textarea|script|style)\b[\s\S]*?<\/\1>/gi,
    (match) => {
      const token = `\u0000${blocks.length}\u0000`;
      blocks.push(match);
      return token;
    }
  );
  return { result, blocks };
}

function restoreBlocks(html: string, blocks: string[]) {
  return blocks.reduce(
    (acc, block, index) => acc.replace(`\u0000${index}\u0000`, () => block),
    html
  );
}

function minifyHTML(html: string): string {
  const { result, blocks } = preserveBlocks(html);
  const minified = result
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, " ")
    .trim();
  return restoreBlocks(minified, blocks);
}

function formatHTML(html: string): string {
  const { result, blocks } = preserveBlocks(html);
  const lines = result
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s*</g, ">\n<")
    .split("\n")
    .filter((line) => line.trim());
  let indent = 0;
  const formatted: string[] = [];

  for (const line of lines) {
    const stripped = line.trim();
    const isBlockToken = /^\u0000\d+\u0000$/.test(stripped);
    const isClosing = stripped.startsWith("</");
    const isSelfClosing =
      stripped.endsWith("/>") || stripped.startsWith("<!") || stripped.startsWith("<?");
    const tagName = stripped.match(/^<\/?([a-zA-Z0-9-]+)/)?.[1]?.toLowerCase();
    const isVoid = tagName ? VOID_TAGS.has(tagName) : false;

    if (isBlockToken) {
      formatted.push("  ".repeat(indent) + stripped);
      continue;
    }

    if (isClosing) {
      indent = Math.max(0, indent - 1);
    }

    formatted.push("  ".repeat(indent) + stripped);

    if (!isClosing && !isSelfClosing && !isVoid) {
      const isInlineClosed = tagName
        ? new RegExp(`</${tagName}\\s*>$`, "i").test(stripped)
        : false;
      if (!isInlineClosed) {
        indent++;
      }
    }
  }

  return restoreBlocks(formatted.join("\n"), blocks);
}

export function HtmlMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleMinify = () => {
    setOutput(minifyHTML(input));
  };

  const handleFormat = () => {
    setOutput(formatHTML(input));
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
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
          <p className="text-muted-foreground text-xs">
            Whitespace inside pre, textarea, script, and style tags is preserved.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Output</CardTitle>
          {output && (
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
          <Textarea
            readOnly
            placeholder="Output will appear here..."
            className="min-h-[400px] font-mono text-sm"
            value={output}
          />
        </CardContent>
      </Card>
    </div>
  );
}
