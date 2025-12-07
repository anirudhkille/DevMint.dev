"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { DownloadIcon, QrCodeIcon } from "lucide-react"

// Simple QR Code generation using canvas
function generateQRCode(text: string, size: number, margin: number): string {
  // Use a data URL approach with an external service for the actual QR
  // This is a fallback - in production you'd use a library like 'qrcode'
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return ""

  canvas.width = size
  canvas.height = size

  // Create QR using a simple encoding for demo
  // In production, use the 'qrcode' npm package
  const qrSize = size - margin * 2
  const moduleCount = 25 // Simplified module count
  const moduleSize = qrSize / moduleCount

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = "#000000"

  // Generate pattern based on text hash
  const hash = text.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  // Draw finder patterns (corners)
  const drawFinderPattern = (x: number, y: number) => {
    const s = moduleSize
    ctx.fillRect(x, y, s * 7, s * 7)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(x + s, y + s, s * 5, s * 5)
    ctx.fillStyle = "#000000"
    ctx.fillRect(x + s * 2, y + s * 2, s * 3, s * 3)
  }

  drawFinderPattern(margin, margin)
  drawFinderPattern(margin + (moduleCount - 7) * moduleSize, margin)
  drawFinderPattern(margin, margin + (moduleCount - 7) * moduleSize)

  // Generate data modules based on text
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      // Skip finder pattern areas
      if ((row < 8 && col < 8) || (row < 8 && col >= moduleCount - 8) || (row >= moduleCount - 8 && col < 8)) {
        continue
      }

      // Generate pseudo-random pattern based on position and text
      const charIndex = (row * moduleCount + col) % text.length
      const charCode = text.charCodeAt(charIndex) || 0
      const shouldFill = (hash + charCode + row * col) % 3 === 0

      if (shouldFill) {
        ctx.fillRect(margin + col * moduleSize, margin + row * moduleSize, moduleSize, moduleSize)
      }
    }
  }

  return canvas.toDataURL("image/png")
}

export function QrCodeGenerator() {
  const [text, setText] = useState("https://devkitlab.dev")
  const [size, setSize] = useState(256)
  const [margin, setMargin] = useState(16)
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (text.trim()) {
      // Use QR code API for actual QR codes
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=${margin / 4}&data=${encodeURIComponent(text)}`
      setQrDataUrl(qrUrl)
    }
  }, [text, size, margin])

  const downloadQR = () => {
    if (!qrDataUrl) return

    // Fetch the image and download it
    fetch(qrDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.download = "qrcode.png"
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
      })
  }

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
            <Slider value={[size]} onValueChange={([v]) => setSize(v)} min={128} max={512} step={32} />
          </div>

          <div className="space-y-2">
            <Label>Margin: {margin}px</Label>
            <Slider value={[margin]} onValueChange={([v]) => setMargin(v)} min={0} max={32} step={4} />
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
              <img
                src={qrDataUrl || "/placeholder.svg"}
                alt="QR Code"
                width={size}
                height={size}
                className="max-w-full"
              />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <QrCodeIcon className="h-16 w-16 mb-4" />
                <p className="text-sm">Enter text to generate QR code</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
