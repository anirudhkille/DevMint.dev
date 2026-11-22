"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type Direction = "yaml-to-json" | "json-to-yaml";

function convert(input: string, direction: Direction) {
  if (!input.trim()) {
    return "";
  }

  const value: unknown =
    direction === "yaml-to-json" ? parseYaml(input) : JSON.parse(input);

  return direction === "yaml-to-json"
    ? JSON.stringify(value, null, 2)
    : stringifyYaml(value, { indent: 2 });
}

export function YamlJsonConverter() {
  const [direction, setDirection] = useState<Direction>("yaml-to-json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleDirectionChange = (value: string) => {
    setDirection(value as Direction);
    setOutput("");
    setError("");
  };

  const handleConvert = () => {
    try {
      setOutput(convert(input, direction));
      setError("");
    } catch (conversionError) {
      setOutput("");
      setError(
        conversionError instanceof Error
          ? conversionError.message
          : "Unable to convert this input."
      );
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={direction} onValueChange={handleDirectionChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="yaml-to-json">YAML to JSON</TabsTrigger>
              <TabsTrigger value="json-to-yaml">JSON to YAML</TabsTrigger>
            </TabsList>
          </Tabs>
          <Textarea
            placeholder={
              direction === "yaml-to-json" ? "Paste YAML here..." : "Paste JSON here..."
            }
            className="min-h-[400px] font-mono text-sm"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleConvert}>Convert</Button>
            <Button variant="outline" onClick={clearAll} disabled={!input && !output}>
              Clear
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Conversion happens entirely in your browser.
          </p>
          {error && (
            <p className="border-destructive/40 bg-destructive/10 text-destructive whitespace-pre-wrap rounded-md border p-3 text-sm">
              {error}
            </p>
          )}
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
            placeholder="Converted output will appear here..."
            className="min-h-[400px] font-mono text-sm"
            value={output}
          />
        </CardContent>
      </Card>
    </div>
  );
}
