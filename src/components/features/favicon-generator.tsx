"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadIcon, DownloadIcon, CopyIcon, CheckIcon, ImageIcon } from "lucide-react";

const FAVICON_SIZES = [16, 32, 48, 64, 128, 180, 192, 512];

interface GeneratedFavicon {
  size: number;
  dataUrl: string;
}

export function FaviconGenerator() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [favicons, setFavicons] = useState<GeneratedFavicon[]>([]);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateFavicons = useCallback((imageSrc: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const generatedFavicons: GeneratedFavicon[] = [];

      FAVICON_SIZES.forEach((size) => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, size, size);
          generatedFavicons.push({
            size,
            dataUrl: canvas.toDataURL("image/png"),
          });
        }
      });

      setFavicons(generatedFavicons);
    };
    img.src = imageSrc;
  }, []);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImage(result);
        generateFavicons(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    },
    [generateFavicons]
  );

  const downloadFavicon = (favicon: GeneratedFavicon) => {
    const link = document.createElement("a");
    link.download = `favicon-${favicon.size}x${favicon.size}.png`;
    link.href = favicon.dataUrl;
    link.click();
  };

  const downloadAll = () => {
    favicons.forEach((favicon) => {
      setTimeout(() => downloadFavicon(favicon), 100);
    });
  };

  const htmlCode = `<!-- Favicon -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">`;

  const copyHtml = async () => {
    await navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upload Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`relative flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
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
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="hidden"
              />
              {originalImage ? (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={originalImage || "/placeholder.svg"}
                    alt="Original"
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                  <p className="text-muted-foreground text-sm">Click or drop to replace</p>
                </div>
              ) : (
                <>
                  <UploadIcon className="text-muted-foreground h-12 w-12" />
                  <p className="text-muted-foreground mt-4 text-sm">
                    Drag and drop an image, or click to browse
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">PNG, JPG, or WebP</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {favicons.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">HTML Link Tags</CardTitle>
              <Button onClick={copyHtml} variant="ghost" size="sm" className="gap-2">
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
              <pre className="bg-muted/50 overflow-auto rounded-lg border p-4 font-mono text-xs">
                {htmlCode}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Generated Favicons</CardTitle>
          {favicons.length > 0 && (
            <Button
              onClick={downloadAll}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <DownloadIcon className="h-4 w-4" />
              Download All
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {favicons.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {favicons.map((favicon) => (
                <div
                  key={favicon.size}
                  className="group hover:bg-accent/50 flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors"
                >
                  <div className="flex h-16 w-16 items-center justify-center">
                    <img
                      src={favicon.dataUrl || "/placeholder.svg"}
                      alt={`${favicon.size}x${favicon.size}`}
                      className="max-h-full max-w-full"
                      style={{
                        imageRendering: favicon.size <= 32 ? "pixelated" : "auto",
                      }}
                    />
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {favicon.size}x{favicon.size}
                  </span>
                  <Button
                    onClick={() => downloadFavicon(favicon)}
                    variant="ghost"
                    size="sm"
                    className="h-7 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <DownloadIcon className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground flex min-h-[300px] flex-col items-center justify-center">
              <ImageIcon className="mb-4 h-12 w-12" />
              <p className="text-sm">Upload an image to generate favicons</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
