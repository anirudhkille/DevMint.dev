"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircleIcon, CheckIcon, CopyIcon, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type DecodedToken = {
  header: unknown;
  payload: Record<string, unknown>;
  signature: string;
};

type DecodeResult =
  | { token: DecodedToken; error: null }
  | { token: null; error: string };

type TokenStatus = {
  label: string;
  className: string;
};

const CLAIM_LABELS = {
  iat: "Issued at",
  nbf: "Not before",
  exp: "Expires",
} as const;

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "="
  );
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function decodeToken(raw: string): DecodedToken {
  const parts = raw.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("A JWT must have three dot-separated parts.");
  }

  const header: unknown = JSON.parse(decodeBase64Url(parts[0]));
  const payload: unknown = JSON.parse(decodeBase64Url(parts[1]));

  if (typeof header !== "object" || header === null) {
    throw new Error("The token header is not a JSON object.");
  }

  if (typeof payload !== "object" || payload === null) {
    throw new Error("The token payload is not a JSON object.");
  }

  return { header, payload: payload as Record<string, unknown>, signature: parts[2] };
}

function formatTimestamp(value: number) {
  return new Date(value * 1000).toLocaleString();
}

type JsonSectionProps = {
  title: string;
  value: unknown;
  id: string;
  copied: string | null;
  onCopy: (value: string, id: string) => void;
};

function JsonSection({ title, value, id, copied, onCopy }: JsonSectionProps) {
  const content = JSON.stringify(value, null, 2);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => onCopy(content, id)}>
          {copied === id ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          {copied === id ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="bg-muted overflow-x-auto rounded-md border p-4 text-xs">
        <code>{content}</code>
      </pre>
    </div>
  );
}

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [status, setStatus] = useState<TokenStatus | null>(null);

  const decoded = useMemo<DecodeResult>(() => {
    if (!token.trim()) {
      return { token: null, error: "" };
    }

    try {
      return { token: decodeToken(token), error: null };
    } catch (error) {
      return {
        token: null,
        error: error instanceof Error ? error.message : "Unable to decode this token.",
      };
    }
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!decoded.token) {
        setStatus(null);
        return;
      }

      const { exp, nbf } = decoded.token.payload;
      const now = Math.floor(Date.now() / 1000);

      if (typeof exp === "number" && exp < now) {
        setStatus({
          label: `Expired ${formatTimestamp(exp)}`,
          className: "border-destructive/40 bg-destructive/10 text-destructive",
        });
        return;
      }

      if (typeof nbf === "number" && nbf > now) {
        setStatus({
          label: `Not valid before ${formatTimestamp(nbf)}`,
          className:
            "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        });
        return;
      }

      if (typeof exp === "number") {
        setStatus({
          label: `Valid until ${formatTimestamp(exp)}`,
          className:
            "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        });
        return;
      }

      setStatus({
        label: "No expiration claim",
        className: "bg-muted text-muted-foreground",
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [decoded.token]);

  const copy = async (value: string, id: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const decodedToken = decoded.token;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Encoded Token</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste a JWT here..."
            className="min-h-[400px] font-mono text-sm"
            value={token}
            onChange={(event) => setToken(event.target.value)}
          />
          <Button variant="outline" onClick={() => setToken("")} disabled={!token}>
            Clear
          </Button>
          <p className="text-muted-foreground text-xs">
            Tokens are decoded locally in your browser. The signature is not verified.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Decoded Token</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {decoded.error && (
            <div className="border-destructive/40 bg-destructive/10 text-destructive flex items-start gap-2 rounded-md border p-3 text-sm">
              <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{decoded.error}</span>
            </div>
          )}

          {!decoded.error && !decodedToken && (
            <div className="border-muted-foreground/25 text-muted-foreground flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6 text-center text-sm">
              <KeyRound className="h-8 w-8" />
              <span>Paste a token to inspect its header and payload.</span>
            </div>
          )}

          {decodedToken && (
            <div className="space-y-4">
              {status && (
                <div
                  className={`rounded-md border p-3 text-sm font-medium ${status.className}`}
                >
                  {status.label}
                </div>
              )}

              <div className="space-y-2">
                {(["iat", "nbf", "exp"] as const).map((claim) => {
                  const value = decodedToken.payload[claim];

                  if (typeof value !== "number") {
                    return null;
                  }

                  return (
                    <div key={claim} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{CLAIM_LABELS[claim]}</span>
                      <span>{formatTimestamp(value)}</span>
                    </div>
                  );
                })}
              </div>

              <JsonSection
                title="Header"
                value={decodedToken.header}
                id="header"
                copied={copied}
                onCopy={copy}
              />
              <JsonSection
                title="Payload"
                value={decodedToken.payload}
                id="payload"
                copied={copied}
                onCopy={copy}
              />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Signature</h3>
                <p className="bg-muted text-muted-foreground break-all rounded-md border p-4 font-mono text-xs">
                  {decodedToken.signature || "No signature"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
