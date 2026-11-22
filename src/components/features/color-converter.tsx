"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function normalizeHex(value: string) {
  const hex = value.trim().replace(/^#/, "");

  if (/^[0-9a-f]{3}$/i.test(hex)) {
    return `#${hex
      .split("")
      .map((character) => character + character)
      .join("")
      .toLowerCase()}`;
  }

  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return `#${hex.toLowerCase()}`;
  }

  return null;
}

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex);

  if (!normalized) {
    return null;
  }

  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    if (max === red) {
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }

    hue /= 6;
  }

  return {
    h: Math.round(hue * 360),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function relativeLuminance(hex: string) {
  const rgb = hexToRgb(hex);

  if (!rgb) {
    return 0;
  }

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(first: string, second: string) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

export function ColorConverter() {
  const [color, setColor] = useState("#6366f1");
  const [hexInput, setHexInput] = useState("#6366f1");
  const [foreground, setForeground] = useState("#111827");
  const [background, setBackground] = useState("#ffffff");
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };
  const hsl = rgbToHsl(rgb);
  const ratio = contrastRatio(foreground, background);
  const isValidHex = normalizeHex(hexInput) !== null;

  const values = [
    { label: "HEX", value: color.toUpperCase() },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
  ];

  const checks = [
    { label: "AA normal", pass: ratio >= 4.5 },
    { label: "AAA normal", pass: ratio >= 7 },
    { label: "AA large", pass: ratio >= 3 },
    { label: "AAA large", pass: ratio >= 4.5 },
  ];

  const handleHexChange = (value: string) => {
    setHexInput(value);
    const normalized = normalizeHex(value);

    if (normalized) {
      setColor(normalized);
    }
  };

  const handlePickerChange = (value: string) => {
    setColor(value);
    setHexInput(value);
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
          <CardTitle className="text-lg">Color Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Input
              type="color"
              value={color}
              onChange={(event) => handlePickerChange(event.target.value)}
              className="h-10 w-14 cursor-pointer p-1"
              aria-label="Pick a color"
            />
            <Input
              value={hexInput}
              onChange={(event) => handleHexChange(event.target.value)}
              onBlur={() => {
                if (!normalizeHex(hexInput)) {
                  setHexInput(color);
                }
              }}
              placeholder="#6366f1"
              className="font-mono"
              aria-label="Hex color"
            />
          </div>
          {!isValidHex && (
            <p className="text-destructive text-xs">
              Enter a valid 3- or 6-digit hex color.
            </p>
          )}
          <div
            className="h-24 rounded-lg border"
            style={{ backgroundColor: color }}
            aria-label={`Color preview ${color}`}
          />
          <div className="space-y-2">
            {values.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 rounded-md border p-3"
              >
                <span className="text-muted-foreground text-xs font-medium uppercase">
                  {label}
                </span>
                <code className="flex-1 text-right font-mono text-sm">{value}</code>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => copy(value, label)}
                  aria-label={`Copy ${label} value`}
                >
                  {copied === label ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contrast Checker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contrast-foreground">Text color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="contrast-foreground"
                  type="color"
                  value={foreground}
                  onChange={(event) => setForeground(event.target.value)}
                  className="h-10 w-14 cursor-pointer p-1"
                />
                <code className="text-sm">{foreground.toUpperCase()}</code>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contrast-background">Background color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="contrast-background"
                  type="color"
                  value={background}
                  onChange={(event) => setBackground(event.target.value)}
                  className="h-10 w-14 cursor-pointer p-1"
                />
                <code className="text-sm">{background.toUpperCase()}</code>
              </div>
            </div>
          </div>

          <div className="flex items-baseline justify-between rounded-md border p-4">
            <span className="text-muted-foreground text-sm">Contrast ratio</span>
            <span className="text-2xl font-semibold">{ratio.toFixed(2)}:1</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {checks.map(({ label, pass }) => (
              <div
                key={label}
                className={`flex items-center gap-2 rounded-md border p-3 text-sm ${
                  pass
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {pass ? (
                  <CheckIcon className="h-4 w-4 shrink-0" />
                ) : (
                  <XIcon className="h-4 w-4 shrink-0" />
                )}
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div
            className="space-y-2 rounded-lg border p-6"
            style={{ backgroundColor: background, color: foreground }}
          >
            <p className="text-lg font-semibold">The quick brown fox jumps over the lazy dog.</p>
            <p className="text-sm">
              Normal text sample. Large text is 18.66px bold or 24px and above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
