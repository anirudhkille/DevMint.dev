"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CopyIcon, CheckIcon } from "lucide-react";

type CaseType =
  | "camelCase"
  | "PascalCase"
  | "snake_case"
  | "kebab-case"
  | "SCREAMING_SNAKE_CASE"
  | "Title Case"
  | "UPPERCASE"
  | "lowercase"
  | "Sentence case";

function splitIntoWords(text: string): string[] {
  // Handle camelCase and PascalCase
  const withSpaces = text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  // Split by common separators
  return withSpaces
    .split(/[\s_-]+/)
    .filter((word) => word.length > 0)
    .map((word) => word.toLowerCase());
}

function convertCase(text: string, caseType: CaseType): string {
  const words = splitIntoWords(text);
  if (words.length === 0) return "";

  switch (caseType) {
    case "camelCase":
      return words
        .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
        .join("");
    case "PascalCase":
      return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
    case "snake_case":
      return words.join("_");
    case "kebab-case":
      return words.join("-");
    case "SCREAMING_SNAKE_CASE":
      return words.map((word) => word.toUpperCase()).join("_");
    case "Title Case":
      return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    case "UPPERCASE":
      return text.toUpperCase();
    case "lowercase":
      return text.toLowerCase();
    case "Sentence case":
      const sentence = words.join(" ");
      return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    default:
      return text;
  }
}

const caseTypes: { type: CaseType; example: string }[] = [
  { type: "camelCase", example: "camelCase" },
  { type: "PascalCase", example: "PascalCase" },
  { type: "snake_case", example: "snake_case" },
  { type: "kebab-case", example: "kebab-case" },
  { type: "SCREAMING_SNAKE_CASE", example: "SCREAMING_SNAKE" },
  { type: "Title Case", example: "Title Case" },
  { type: "UPPERCASE", example: "UPPERCASE" },
  { type: "lowercase", example: "lowercase" },
  { type: "Sentence case", example: "Sentence case" },
];

export function TextCaseConverter() {
  const [input, setInput] = useState("Hello World Example");
  const [copiedType, setCopiedType] = useState<CaseType | null>(null);

  const copyResult = async (caseType: CaseType) => {
    const result = convertCase(input, caseType);
    await navigator.clipboard.writeText(result);
    setCopiedType(caseType);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Input Text</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter your text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[120px] text-lg"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {caseTypes.map(({ type, example }) => {
              const result = convertCase(input, type);
              const isCopied = copiedType === type;

              return (
                <div
                  key={type}
                  className="group hover:bg-accent/50 relative flex flex-col gap-2 rounded-lg border p-4 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-medium">{type}</span>
                    <Button
                      onClick={() => copyResult(type)}
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      {isCopied ? (
                        <CheckIcon className="h-3 w-3" />
                      ) : (
                        <CopyIcon className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <code className="font-mono text-sm break-all">
                    {result || <span className="text-muted-foreground">-</span>}
                  </code>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
