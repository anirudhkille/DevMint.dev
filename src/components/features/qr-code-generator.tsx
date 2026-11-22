"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { DownloadIcon, QrCodeIcon } from "lucide-react";
import Image from "next/image";
import QRCode from "qrcode";

export function QrCodeGenerator() {
  const [text, setText] = useState("https://devmint.dev");
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(4);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      if (!text.trim()) {
        if (!cancelled) setQrDataUrl("");
        return;
      }

      try {
        const url = await QRCode.toDataURL(text, {
          width: size,
          margin,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });
        if (!cancelled) setQrDataUrl(url);
      } catch {
        if (!cancelled) setQrDataUrl("");
      }
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, size, margin]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              placeholder="Enter URL or text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Size: {size}px</Label>
            <Slider
              value={[size]}
              onValueChange={([v]) => setSize(v)}
              min={128}
              max={512}
              step={32}
            />
          </div>

          <div className="space-y-2">
            <Label>Quiet zone: {margin} modules</Label>
            <Slider
              value={[margin]}
              onValueChange={([v]) => setMargin(v)}
              min={0}
              max={8}
              step={1}
            />
            <p className="text-muted-foreground text-xs">
              Empty space around the QR code, measured in modules.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Preview</CardTitle>
          <Button
            onClick={downloadQR}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
            disabled={!qrDataUrl}
          >
            <DownloadIcon className="h-4 w-4" />
            Download PNG
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border bg-white p-8">
            {text.trim() && qrDataUrl ? (
              <Image
                src={qrDataUrl}
                alt="QR Code"
                width={size}
                height={size}
                className="max-w-full"
                unoptimized
              />
            ) : (
              <div className="text-muted-foreground flex flex-col items-center">
                <QrCodeIcon className="mb-4 h-16 w-16" />
                <p className="text-sm">Enter text to generate QR code</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
