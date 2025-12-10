"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { DownloadIcon, QrCodeIcon } from "lucide-react";
import Image from "next/image";

export function QrCodeGenerator() {
  const [text, setText] = useState("https://devkitlab.dev");
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(16);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (text.trim()) {
      // Use QR code API for actual QR codes
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=${margin / 4}&data=${encodeURIComponent(text)}`;
      setQrDataUrl(qrUrl);
    }
  }, [text, size, margin]);

  const downloadQR = () => {
    if (!qrDataUrl) return;

    // Fetch the image and download it
    fetch(qrDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
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
            disabled={!text.trim()}
          >
            <DownloadIcon className="h-4 w-4" />
            Download PNG
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border bg-white p-8">
            {text.trim() ? (
              <Image
                src={qrDataUrl || "/placeholder.svg"}
                alt="QR Code"
                width={size}
                height={size}
                className="max-w-full"
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
