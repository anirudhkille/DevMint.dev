"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckIcon,
  CopyIcon,
  HashIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  RefreshCwIcon,
} from "lucide-react";
import * as bcrypt from "bcryptjs";

export function BcryptGenerator() {
  const [input, setInput] = useState("");
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState("");
  const [generatedCopied, setGeneratedCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [compareInput, setCompareInput] = useState("");
  const [compareHash, setCompareHash] = useState("");
  const [compareResult, setCompareResult] = useState<boolean | null>(null);
  const [comparing, setComparing] = useState(false);

  const generateHash = async () => {
    if (!input.trim()) return;
    setGenerating(true);
    try {
      const result = await bcrypt.hash(input, rounds);
      setHash(result);
    } catch {
      setHash("");
    } finally {
      setGenerating(false);
    }
  };

  const copyHash = async () => {
    await navigator.clipboard.writeText(hash);
    setGeneratedCopied(true);
    setTimeout(() => setGeneratedCopied(false), 2000);
  };

  const handleCompare = async () => {
    if (!compareInput.trim() || !compareHash.trim()) return;
    setComparing(true);
    try {
      const match = await bcrypt.compare(compareInput, compareHash.trim());
      setCompareResult(match);
    } catch {
      setCompareResult(false);
    } finally {
      setComparing(false);
    }
  };

  const resetCompare = () => {
    setCompareInput("");
    setCompareHash("");
    setCompareResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="generate">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate" className="gap-2">
                <HashIcon className="h-4 w-4" />
                Generate Hash
              </TabsTrigger>
              <TabsTrigger value="compare" className="gap-2">
                <ShieldCheckIcon className="h-4 w-4" />
                Compare Hash
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Text to Hash</Label>
                <Textarea
                  placeholder="Enter text to hash..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Rounds (cost factor): {rounds}</Label>
                <Slider
                  value={[rounds]}
                  onValueChange={([v]) => setRounds(v)}
                  min={4}
                  max={15}
                  step={1}
                />
                <p className="text-muted-foreground text-xs">
                  Higher rounds are slower but more secure. 10-12 is recommended.
                </p>
              </div>

              <Button onClick={generateHash} disabled={!input.trim() || generating} className="gap-2">
                {generating ? (
                  <RefreshCwIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <HashIcon className="h-4 w-4" />
                )}
                {generating ? "Generating..." : "Generate Hash"}
              </Button>

              {hash && (
                <div className="space-y-2">
                  <Label>Bcrypt Hash</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={hash} className="font-mono text-sm" />
                    <Button
                      onClick={copyHash}
                      variant="outline"
                      size="icon"
                      aria-label="Copy hash"
                    >
                      {generatedCopied ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        <CopyIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="compare" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Text</Label>
                <Input
                  placeholder="Enter original text..."
                  value={compareInput}
                  onChange={(e) => {
                    setCompareInput(e.target.value);
                    setCompareResult(null);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Bcrypt Hash</Label>
                <Textarea
                  placeholder="Paste bcrypt hash..."
                  value={compareHash}
                  onChange={(e) => {
                    setCompareHash(e.target.value);
                    setCompareResult(null);
                  }}
                  className="min-h-[80px] font-mono text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleCompare}
                  disabled={!compareInput.trim() || !compareHash.trim() || comparing}
                  className="gap-2"
                >
                  {comparing ? (
                    <RefreshCwIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheckIcon className="h-4 w-4" />
                  )}
                  {comparing ? "Comparing..." : "Compare"}
                </Button>
                <Button onClick={resetCompare} variant="outline">
                  Clear
                </Button>
              </div>

              {compareResult !== null && (
                <div
                  className={`flex items-start gap-3 rounded-lg border p-4 ${
                    compareResult
                      ? "border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/20"
                      : "border-destructive/50 bg-destructive/10"
                  }`}
                >
                  {compareResult ? (
                    <CheckCircleIcon className="text-emerald-600 mt-0.5 h-5 w-5" />
                  ) : (
                    <XCircleIcon className="text-destructive mt-0.5 h-5 w-5" />
                  )}
                  <div>
                    <p
                      className={
                        compareResult ? "text-emerald-600 font-medium" : "text-destructive font-medium"
                      }
                    >
                      {compareResult ? "Match!" : "No Match"}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {compareResult
                        ? "The text matches the hash."
                        : "The text does not match the hash, or the hash is invalid."}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
