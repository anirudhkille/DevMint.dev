"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckIcon, CopyIcon, PlusIcon, TrashIcon, FileTextIcon } from "lucide-react";

type RuleType = "user-agent" | "allow" | "disallow" | "crawl-delay" | "sitemap";

type Rule = {
  id: string;
  type: RuleType;
  value: string;
};

const ruleLabels: Record<RuleType, string> = {
  "user-agent": "User-agent",
  allow: "Allow",
  disallow: "Disallow",
  "crawl-delay": "Crawl-delay",
  sitemap: "Sitemap",
};

function generateRobotsTxt(rules: Rule[]): string {
  const grouped: Record<string, Rule[]> = {};
  let sitemaps: string[] = [];

  for (const rule of rules) {
    if (!rule.value.trim()) continue;
    if (rule.type === "sitemap") {
      sitemaps.push(rule.value.trim());
      continue;
    }
    const key = rule.type === "user-agent" ? rule.value.trim() : "__rules__";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(rule);
  }

  const lines: string[] = [];

  for (const [agent, agentRules] of Object.entries(grouped)) {
    if (agent === "__rules__") {
      for (const r of agentRules) {
        if (r.value.trim()) {
          lines.push(`${ruleLabels[r.type]}: ${r.value.trim()}`);
        }
      }
    } else {
      lines.push(`${ruleLabels["user-agent"]}: ${agent}`);
      for (const r of agentRules) {
        if (r.type !== "user-agent" && r.value.trim()) {
          lines.push(`${ruleLabels[r.type]}: ${r.value.trim()}`);
        }
      }
      lines.push("");
    }
  }

  for (const s of sitemaps) {
    lines.push(`${ruleLabels["sitemap"]}: ${s}`);
  }

  return lines.join("\n").trim();
}

let nextId = 1;

export function RobotsTxtGenerator() {
  const [rules, setRules] = useState<Rule[]>([
    { id: "1", type: "user-agent", value: "*" },
    { id: "2", type: "disallow", value: "" },
  ]);

  const addRule = (type: RuleType) => {
    setRules((prev) => [...prev, { id: String(++nextId), type, value: "" }]);
  };

  const updateRule = (id: string, field: "type" | "value", val: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: field === "type" ? (val as RuleType) : val } : r)),
    );
  };

  const removeRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const output = useMemo(() => generateRobotsTxt(rules), [rules]);

  const [copied, setCopied] = useState(false);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Rules</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => addRule("user-agent")} variant="outline" size="sm" className="gap-1">
              <PlusIcon className="h-3 w-3" />
              User-agent
            </Button>
            <Button onClick={() => addRule("disallow")} variant="outline" size="sm" className="gap-1">
              <PlusIcon className="h-3 w-3" />
              Disallow
            </Button>
            <Button onClick={() => addRule("allow")} variant="outline" size="sm" className="gap-1">
              <PlusIcon className="h-3 w-3" />
              Allow
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {rules.length === 0 && (
            <p className="text-muted-foreground text-sm">No rules added yet.</p>
          )}
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-start gap-2">
              <Select value={rule.type} onValueChange={(v) => updateRule(rule.id, "type", v)}>
                <SelectTrigger className="w-[140px] shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ruleLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder={
                  rule.type === "user-agent"
                    ? "e.g. * or Googlebot"
                    : rule.type === "crawl-delay"
                      ? "e.g. 10"
                      : rule.type === "sitemap"
                        ? "e.g. https://example.com/sitemap.xml"
                        : "e.g. /admin"
                }
                value={rule.value}
                onChange={(e) => updateRule(rule.id, "value", e.target.value)}
                className="flex-1 font-mono text-sm"
              />
              <Button
                onClick={() => removeRule(rule.id)}
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={() => addRule("crawl-delay")} variant="outline" size="sm" className="gap-1">
              <PlusIcon className="h-3 w-3" />
              Crawl-delay
            </Button>
            <Button onClick={() => addRule("sitemap")} variant="outline" size="sm" className="gap-1">
              <PlusIcon className="h-3 w-3" />
              Sitemap
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">robots.txt</CardTitle>
          <Button onClick={copyOutput} variant="ghost" size="sm" className="gap-2" disabled={!output}>
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
        </CardHeader>
        <CardContent>
          {output ? (
            <pre className="bg-muted/50 min-h-[300px] overflow-auto rounded-lg border p-4 font-mono text-sm">
              {output}
            </pre>
          ) : (
            <div className="text-muted-foreground flex min-h-[300px] flex-col items-center justify-center">
              <FileTextIcon className="mb-2 h-8 w-8" />
              <p className="text-sm">Add rules to generate robots.txt</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
