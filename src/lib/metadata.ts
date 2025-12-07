import { Metadata } from "next";

type GenerateMetaProps = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
};

export function generateMetadata({
  title,
  description,
  path = "",
  keywords = [],
  image = "/og-image.png",
}: GenerateMetaProps): Metadata {
  const baseUrl = "https://devmint.dev";
  const fullUrl = `${baseUrl}${path}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,

    alternates: {
      canonical: fullUrl,
    },

    authors: [{ name: "Devmint.dev", url: "https://devmint.dev" }],
    creator: "Devmint.dev",

    openGraph: {
      type: "website",
      url: fullUrl,
      title,
      description,
      siteName: "Devmint.dev",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "Devmint.dev",
      images: [image],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
