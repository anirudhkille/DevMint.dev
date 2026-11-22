"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  CaseSensitive,
  CheckIcon,
  CopyIcon,
  Fingerprint,
  Minus,
  RefreshCwIcon,
} from "lucide-react";

function createUuid(): string {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function formatUuid(uuid: string, uppercase: boolean, hyphens: boolean) {
  const value = hyphens ? uuid : uuid.replace(/-/g, "");
  return uppercase ? value.toUpperCase() : value;
}

export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const formattedUuids = uuids.map((uuid) => formatUuid(uuid, uppercase, hyphens));

  const generate = () => {
    setUuids(Array.from({ length: count }, createUuid));
    setCopied(null);
  };

  const copy = async (value: string, id: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Number of UUIDs</Label>
              <span className="text-muted-foreground font-mono text-sm">{count}</span>
            </div>
            <Slider
              value={[count]}
              onValueChange={(value) => setCount(value[0])}
              min={1}
              max={50}
              step={1}
            />
            <p className="text-muted-foreground text-xs">Generate up to 50 UUIDs per batch.</p>
          </div>

          <div className="space-y-2">
            <Label>Format</Label>
            <Button
              onClick={() => setUppercase((value) => !value)}
              variant={uppercase ? "secondary" : "outline"}
              className="w-full justify-start gap-2"
            >
              <CaseSensitive className="h-4 w-4" />
              Uppercase: {uppercase ? "On" : "Off"}
            </Button>
            <Button
              onClick={() => setHyphens((value) => !value)}
              variant={hyphens ? "secondary" : "outline"}
              className="w-full justify-start gap-2"
            >
              <Minus className="h-4 w-4" />
              Hyphens: {hyphens ? "On" : "Off"}
            </Button>
          </div>

          <Button onClick={generate} className="w-full gap-2">
            <RefreshCwIcon className="h-4 w-4" />
            {uuids.length > 0 ? "Regenerate" : "Generate"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Output</CardTitle>
          {formattedUuids.length > 0 && (
            <Button
              onClick={() => copy(formattedUuids.join("\n"), "all")}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              {copied === "all" ? (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon className="h-4 w-4" />
                  Copy all
                </>
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {formattedUuids.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Fingerprint className="text-muted-foreground mb-3 h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                No UUIDs yet. Choose a count and click Generate.
              </p>
            </div>
          ) : (
            <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {formattedUuids.map((value, index) => (
                <div
                  key={uuids[index]}
                  className="flex items-center gap-2 rounded-md border p-2 pl-3"
                >
                  <span className="text-muted-foreground w-6 shrink-0 text-xs">{index + 1}</span>
                  <code className="flex-1 break-all font-mono text-sm">{value}</code>
                  <Button
                    onClick={() => copy(value, uuids[index])}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    aria-label={`Copy UUID ${index + 1}`}
                  >
                    {copied === uuids[index] ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
