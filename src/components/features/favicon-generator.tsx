"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadIcon, DownloadIcon, CopyIcon, CheckIcon, ImageIcon } from "lucide-react";
import Image from "next/image";

const FAVICON_SIZES = [16, 32, 48, 64, 128, 180, 192, 512];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface GeneratedFavicon {
  size: number;
  dataUrl: string;
}

const faviconLinks = FAVICON_SIZES.map((size) =>
  size === 180
    ? `<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">`
    : `<link rel="icon" type="image/png" sizes="${size}x${size}" href="/favicon-${size}x${size}.png">`
);

const htmlCode = `<!-- Favicon -->\n${faviconLinks.join("\n")}`;

export function FaviconGenerator() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [favicons, setFavicons] = useState<GeneratedFavicon[]>([]);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateFavicons = useCallback((imageSrc: string) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const generatedFavicons: GeneratedFavicon[] = [];

      FAVICON_SIZES.forEach((size) => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, size, size);
        generatedFavicons.push({
          size,
          dataUrl: canvas.toDataURL("image/png"),
        });
      });

      setFavicons(generatedFavicons);
    };
    img.onerror = () => {
      setError("Could not read this image. Please try another file.");
    };
    img.src = imageSrc;
  }, []);

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Image is too large. Please select a file under 10 MB.");
        return;
      }

      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImage(result);
        generateFavicons(result);
      };
      reader.readAsDataURL(file);
    },
    [generateFavicons]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileChange(e.dataTransfer.files[0] ?? null);
    },
    [handleFileChange]
  );

  const downloadFavicon = (favicon: GeneratedFavicon) => {
    const link = document.createElement("a");
    link.download = `favicon-${favicon.size}x${favicon.size}.png`;
    link.href = favicon.dataUrl;
    link.click();
  };

  const downloadAll = () => {
    favicons.forEach((favicon, index) => {
      setTimeout(() => downloadFavicon(favicon), index * 150);
    });
  };

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
              role="button"
              tabIndex={0}
              aria-label="Upload an image to generate favicons"
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
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              {originalImage ? (
                <div className="flex flex-col items-center gap-4">
                  <Image
                    src={originalImage}
                    alt="Original"
                    width={128}
                    height={128}
                    unoptimized
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
            {error && <p className="text-destructive mt-3 text-sm">{error}</p>}
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
                    <Image
                      src={favicon.dataUrl}
                      alt={`${favicon.size}x${favicon.size} favicon`}
                      width={favicon.size}
                      height={favicon.size}
                      unoptimized
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
                    className="h-7 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Download ${favicon.size}x${favicon.size} favicon`}
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
