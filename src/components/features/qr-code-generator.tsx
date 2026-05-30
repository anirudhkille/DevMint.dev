"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { DownloadIcon, QrCodeIcon } from "lucide-react";
import Image from "next/image";
import QRCode from "qrcode";

export function QrCodeGenerator() {
  const [text, setText] = useState("https://devkitlab.dev");
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(16);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const generateQR = useCallback(async () => {
    if (!text.trim()) {
      setQrDataUrl("");
      return;
    }
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: Math.round(margin / 4),
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      setQrDataUrl(url);
    } catch {
      setQrDataUrl("");
    }
  }, [text, size, margin]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

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
            <Label>Margin: {margin}px</Label>
            <Slider
              value={[margin]}
              onValueChange={([v]) => setMargin(v)}
              min={0}
              max={32}
              step={4}
            />
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
            disabled={!text.trim() || !qrDataUrl}
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
