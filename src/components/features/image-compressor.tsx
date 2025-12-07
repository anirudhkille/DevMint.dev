"use client";

import type React from "react";

import { useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { UploadIcon, ImageIcon, DownloadIcon, XIcon } from "lucide-react";

export function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState([80]);
  const [fileName, setFileName] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.match(/image\/(png|jpeg|jpg|webp)/)) {
      return;
    }

    setFileName(file.name);
    setOriginalSize(file.size);
    setCompressedImage(null);
    setCompressedSize(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const compressImage = useCallback(() => {
    if (!originalImage) return;

    setIsCompressing(true);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality[0] / 100);
      setCompressedImage(compressedDataUrl);

      const base64Length = compressedDataUrl.split(",")[1].length;
      const sizeInBytes = (base64Length * 3) / 4;
      setCompressedSize(sizeInBytes);
      setIsCompressing(false);
    };
    img.src = originalImage;
  }, [originalImage, quality]);

  const downloadImage = useCallback(() => {
    if (!compressedImage) return;

    const link = document.createElement("a");
    link.href = compressedImage;
    const nameParts = fileName.split(".");
    nameParts.pop();
    link.download = `${nameParts.join(".")}-compressed.jpg`;
    link.click();
  }, [compressedImage, fileName]);

  const resetImage = useCallback(() => {
    setOriginalImage(null);
    setCompressedImage(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {!originalImage ? (
        <Card
          className={`border-2 border-dashed transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <UploadIcon className="text-muted-foreground h-8 w-8" />
            </div>
            <p className="mb-2 text-lg font-medium">Drop your image here</p>
            <p className="text-muted-foreground mb-6 text-sm">
              or click to browse (PNG, JPG, WebP)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Select Image
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageIcon className="text-muted-foreground h-5 w-5" />
                  <span className="max-w-[200px] truncate font-medium">{fileName}</span>
                  <span className="text-muted-foreground text-sm">
                    ({formatSize(originalSize)})
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={resetImage}>
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-muted-foreground mb-2 text-sm font-medium">Original</p>
                  <div className="border-border bg-muted aspect-video overflow-hidden rounded-lg border">
                    <img
                      src={originalImage || "/placeholder.svg"}
                      alt="Original"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2 text-sm font-medium">
                    Compressed
                    {compressedSize > 0 && (
                      <span className="text-primary ml-2">({formatSize(compressedSize)})</span>
                    )}
                  </p>
                  <div className="border-border bg-muted aspect-video overflow-hidden rounded-lg border">
                    {compressedImage ? (
                      <img
                        src={compressedImage || "/placeholder.svg"}
                        alt="Compressed"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                        Adjust quality and compress
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <Label>Compression Quality</Label>
                  <span className="text-sm font-medium">{quality[0]}%</span>
                </div>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  min={10}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-muted-foreground mt-2 text-xs">
                  Lower quality = smaller file size
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={compressImage} disabled={isCompressing} className="flex-1">
                  {isCompressing ? "Compressing..." : "Compress Image"}
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadImage}
                  disabled={!compressedImage}
                  className="flex-1 bg-transparent"
                >
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download Compressed
                </Button>
              </div>

              {compressedSize > 0 && originalSize > 0 && (
                <div className="bg-muted mt-4 rounded-lg p-4 text-center">
                  <p className="text-muted-foreground text-sm">
                    Reduced by{" "}
                    <span className="text-primary font-semibold">
                      {Math.round((1 - compressedSize / originalSize) * 100)}%
                    </span>{" "}
                    ({formatSize(originalSize)} → {formatSize(compressedSize)})
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
