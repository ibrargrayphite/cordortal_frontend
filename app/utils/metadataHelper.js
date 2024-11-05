// metadataHelper.js

export async function generateMetadata(currentSeo, currentLocation) {
    console.log("🚀 ~ generateMetadata ~ currentLocation:", currentLocation)
    console.log("🚀 ~ generateMetadata ~ currentSeo:", currentSeo)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": currentSeo.title,
      "description": currentSeo.description,
      "url": currentSeo.url,
      "image": currentLocation.media?.headerLogo,
    };
  
    return {
      title: currentSeo.title,
      description: currentSeo.description,
      keywords: currentSeo.keywords,
      viewport: "width=device-width, initial-scale=1",
      robots: "index, follow",
      openGraph: {
        title: currentSeo.title,
        description: currentSeo.description,
        url: currentSeo.url,
        type: "website",
        images: [
          {
            url: currentLocation.media?.headerLogo || "https://example.com/images/fallback.png",
            width: 800,
            height: 600,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: currentSeo.title,
        description: currentSeo.description,
        images: [currentLocation.media?.headerLogo],
      },
      alternates: {
        canonical: currentSeo.canonical,
        languages: {
          "en": "https://yourwebsite.com/en/page",
          "es": "https://yourwebsite.com/es/page",
        },
      },
      verification: {
        google: "your-google-site-verification-code",
        bing: "your-bing-site-verification-code",
      },
      icons: [
        { rel: "icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
      structuredData: JSON.stringify(structuredData),
    };
  }
  