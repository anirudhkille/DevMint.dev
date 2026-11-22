"use client";

import { useEffect, useState } from "react";
import SparkMD5 from "spark-md5";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckIcon, CopyIcon, HashIcon } from "lucide-react";

const ALGORITHMS = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

type Algorithm = (typeof ALGORITHMS)[number];

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function computeHash(text: string, algorithm: Algorithm) {
  if (algorithm === "MD5") {
    return SparkMD5.hash(text);
  }

  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algorithm, data);
  return toHex(digest);
}

export function HashGenerator() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [hash, setHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      if (!input) {
        if (!cancelled) {
          setHash("");
          setError("");
        }
        return;
      }

      try {
        const value = await computeHash(input, algorithm);
        if (!cancelled) {
          setHash(value);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setHash("");
          setError("Unable to compute the hash for this input.");
        }
      }
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [input, algorithm]);

  const copyHash = async () => {
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput("");
    setHash("");
    setError("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hash-input">Text</Label>
            <Textarea
              id="hash-input"
              placeholder="Enter text to hash..."
              className="min-h-[240px] font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Algorithm</Label>
            <Select
              value={algorithm}
              onValueChange={(value) => setAlgorithm(value as Algorithm)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALGORITHMS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={clearAll} disabled={!input}>
            Clear
          </Button>
          <p className="text-muted-foreground text-xs">
            Hashes are computed locally in your browser. Nothing is uploaded.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Hash</CardTitle>
          {hash && (
            <Button
              onClick={copyHash}
              variant="ghost"
              size="sm"
              className="gap-2"
              aria-label="Copy hash"
            >
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
        <CardContent className="space-y-4">
          {hash ? (
            <>
              <div className="bg-muted rounded-md border p-4">
                <code className="break-all font-mono text-sm">{hash}</code>
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>{algorithm}</span>
                <span>{hash.length} hex characters</span>
              </div>
            </>
          ) : (
            <div className="border-muted-foreground/25 flex min-h-[240px] flex-col items-center justify-center rounded-md border border-dashed p-6 text-center">
              <HashIcon className="text-muted-foreground/50 mb-3 h-10 w-10" />
              <p className="text-muted-foreground text-sm">Enter text to generate a hash.</p>
            </div>
          )}
          {error && <p className="text-destructive text-sm">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
