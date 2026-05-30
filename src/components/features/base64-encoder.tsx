"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckIcon,
  CopyIcon,
  ScanText,
  ArrowLeftRightIcon,
  AlertCircleIcon,
} from "lucide-react";

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decodeBase64(base64: string): string {
  const binary = atob(base64.trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleEncode = () => {
    try {
      setOutput(encodeBase64(input));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const handleDecode = () => {
    try {
      setOutput(decodeBase64(input));
      setError(null);
    } catch (e) {
      setError("Invalid Base64 input");
      setOutput("");
    }
  };

  const handleAction = () => {
    if (!input.trim()) return;
    if (mode === "encode") handleEncode();
    else handleDecode();
  };

  const toggleMode = () => {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput(output);
    setOutput("");
    setError(null);
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Input</CardTitle>
          <Button onClick={toggleMode} variant="outline" size="sm" className="gap-2">
            <ArrowLeftRightIcon className="h-4 w-4" />
            Switch to {mode === "encode" ? "Decode" : "Encode"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={
              mode === "encode"
                ? "Enter text to encode to Base64..."
                : "Enter Base64 string to decode..."
            }
            className="min-h-[300px] font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAction} className="gap-2">
              <ScanText className="h-4 w-4" />
              {mode === "encode" ? "Encode" : "Decode"}
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
              className="min-h-[300px] font-mono text-sm"
              value={output}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
