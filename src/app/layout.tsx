import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Footer } from "@/layout/footer";
import { Header } from "@/layout/header";

export const metadata: Metadata = {
  metadataBase: new URL("https://devmint.dev"),
  title: "DevMint — Free Developer Tools",
  description:
    "A free collection of fast, privacy-friendly developer tools. Compress images, format JSON, generate QR codes and favicons, and more — all in your browser.",
  keywords: [
    "developer tools",
    "free developer tools",
    "online tools",
    "image compressor",
    "json formatter",
    "qr code generator",
    "favicon generator",
  ],
  authors: [{ name: "Anirudh Kille", url: "https://anirudhkille.com" }],
  creator: "DevMint.dev",
  openGraph: {
    type: "website",
    url: "https://devmint.dev",
    title: "DevMint — Free Developer Tools",
    description:
      "A free collection of fast, privacy-friendly developer tools that run entirely in your browser.",
    siteName: "DevMint.dev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevMint — Free Developer Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevMint — Free Developer Tools",
    description:
      "A free collection of fast, privacy-friendly developer tools that run entirely in your browser.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
