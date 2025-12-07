"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckIcon, CopyIcon, PlusIcon, TrashIcon } from "lucide-react";

type GradientType = "linear" | "radial" | "conic";

interface ColorStop {
  color: string;
  position: number;
}

export function GradientGenerator() {
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(90);
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: "#3b82f6", position: 0 },
    { color: "#8b5cf6", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const generateGradientCSS = () => {
    const stops = colorStops
      .sort((a, b) => a.position - b.position)
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    switch (gradientType) {
      case "linear":
        return `linear-gradient(${angle}deg, ${stops})`;
      case "radial":
        return `radial-gradient(circle, ${stops})`;
      case "conic":
        return `conic-gradient(from ${angle}deg, ${stops})`;
      default:
        return "";
    }
  };

  const cssCode = `background: ${generateGradientCSS()};`;

  const copyCSS = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addColorStop = () => {
    if (colorStops.length < 5) {
      setColorStops([...colorStops, { color: "#10b981", position: 50 }]);
    }
  };

  const removeColorStop = (index: number) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter((_, i) => i !== index));
    }
  };

  const updateColorStop = (index: number, updates: Partial<ColorStop>) => {
    setColorStops(colorStops.map((stop, i) => (i === index ? { ...stop, ...updates } : stop)));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Gradient Type</Label>
            <Select value={gradientType} onValueChange={(v) => setGradientType(v as GradientType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
                <SelectItem value="conic">Conic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(gradientType === "linear" || gradientType === "conic") && (
            <div className="space-y-2">
              <Label>Angle: {angle}°</Label>
              <Slider
                value={[angle]}
                onValueChange={([v]) => setAngle(v)}
                min={0}
                max={360}
                step={1}
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Color Stops</Label>
              <Button
                onClick={addColorStop}
                variant="outline"
                size="sm"
                disabled={colorStops.length >= 5}
                className="gap-1"
              >
                <PlusIcon className="h-4 w-4" />
                Add
              </Button>
            </div>

            {colorStops.map((stop, index) => (
              <div key={index} className="flex items-center gap-3">
                <Input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateColorStop(index, { color: e.target.value })}
                  className="h-10 w-14 cursor-pointer p-1"
                />
                <Input
                  type="text"
                  value={stop.color}
                  onChange={(e) => updateColorStop(index, { color: e.target.value })}
                  className="flex-1 font-mono text-sm"
                />
                <div className="flex w-24 items-center gap-2">
                  <Input
                    type="number"
                    value={stop.position}
                    onChange={(e) => updateColorStop(index, { position: Number(e.target.value) })}
                    min={0}
                    max={100}
                    className="text-sm"
                  />
                  <span className="text-muted-foreground text-sm">%</span>
                </div>
                <Button
                  onClick={() => removeColorStop(index)}
                  variant="ghost"
                  size="icon"
                  disabled={colorStops.length <= 2}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="h-64 w-full rounded-lg border"
              style={{ background: generateGradientCSS() }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">CSS Code</CardTitle>
            <Button onClick={copyCSS} variant="ghost" size="sm" className="gap-2">
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
            <pre className="bg-muted/50 overflow-auto rounded-lg border p-4 font-mono text-sm">
              {cssCode}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
