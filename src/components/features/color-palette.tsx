"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCwIcon, UploadIcon, CopyIcon, CheckIcon, DownloadIcon } from "lucide-react";

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
}

function generateHarmoniousPalette(): Color[] {
  const baseHue = Math.random() * 360;
  const colors: Color[] = [];

  for (let i = 0; i < 5; i++) {
    const hue = (baseHue + i * 30) % 360;
    const saturation = 60 + Math.random() * 30;
    const lightness = 40 + Math.random() * 30;
    const { r, g, b } = hslToRgb(hue, saturation, lightness);
    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    colors.push({ hex, rgb: { r, g, b } });
  }

  return colors;
}

function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
}

export function ColorPaletteGenerator() {
  const [palette, setPalette] = useState<Color[]>(generateHarmoniousPalette);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateNewPalette = () => {
    setPalette(generateHarmoniousPalette());
  };

  const extractFromImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);

        const imageData = ctx.getImageData(0, 0, 100, 100).data;
        const colorMap = new Map<string, number>();

        for (let i = 0; i < imageData.length; i += 4) {
          const r = Math.round(imageData[i] / 32) * 32;
          const g = Math.round(imageData[i + 1] / 32) * 32;
          const b = Math.round(imageData[i + 2] / 32) * 32;
          const key = `${r},${g},${b}`;
          colorMap.set(key, (colorMap.get(key) || 0) + 1);
        }

        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([key]) => {
            const [r, g, b] = key.split(",").map(Number);
            const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
            return { hex, rgb: { r, g, b } };
          });

        setPalette(sortedColors);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      extractFromImage(file);
    }
  };

  const copyColor = async (color: Color, index: number, format: "hex" | "rgb") => {
    const value =
      format === "hex" ? color.hex : `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    await navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const exportPalette = () => {
    const json = JSON.stringify(
      palette.map((c) => ({
        hex: c.hex,
        rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
      })),
      null,
      2
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "palette.json";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Color Palette</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={generateNewPalette}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <RefreshCwIcon className="h-4 w-4" />
              Generate
            </Button>
            <Button
              onClick={exportPalette}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <DownloadIcon className="h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {palette.map((color, index) => (
              <div key={index} className="space-y-2">
                <div
                  className="aspect-square w-full rounded-lg border shadow-sm transition-transform hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="space-y-1">
                  <button
                    onClick={() => copyColor(color, index, "hex")}
                    className="hover:bg-accent/50 flex w-full items-center justify-between rounded px-2 py-1 font-mono text-xs"
                  >
                    <span>{color.hex.toUpperCase()}</span>
                    {copiedIndex === index ? (
                      <CheckIcon className="h-3 w-3" />
                    ) : (
                      <CopyIcon className="h-3 w-3 opacity-50" />
                    )}
                  </button>
                  <button
                    onClick={() => copyColor(color, index, "rgb")}
                    className="text-muted-foreground hover:bg-accent/50 flex w-full items-center justify-between rounded px-2 py-1 font-mono text-xs"
                  >
                    <span>
                      {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Extract from Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) extractFromImage(file);
              }}
              className="hidden"
            />
            <UploadIcon className="text-muted-foreground h-8 w-8" />
            <p className="text-muted-foreground mt-2 text-sm">
              Drop an image or click to extract colors
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
