export async function generateCustomMetadata(currentLocation, currentPage) {
  // console.log("🚀 ~ generateMetadata ~ currentPage:", currentPage);

  // Get SEO configuration for the current page
  const SEO_CONFIG = currentLocation?.seo_config || {};
  const currentSeo = SEO_CONFIG[currentPage];
  // console.log("🚀 ~ generateMetadata ~ currentSeo:", currentSeo);

  // Set fallback values
  const fav = currentLocation?.favIcon;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": currentSeo?.title ?? "Default SEO Title",
    "description": currentSeo?.description ?? "Default SEO Description",
    "url": currentSeo?.url ?? "https://example.com",
    "image": currentLocation?.media?.headerLogo ?? "https://example.com/images/fallback.png",
  };

  const meta = {
    title: currentSeo?.title ?? "Default Title",
    description: currentSeo?.description ?? "Default Description",
    keywords: currentSeo?.keywords ?? "Default Keywords",
    viewport: "width=device-width, initial-scale=1",
    robots: "index, follow",
    openGraph: {
      title: currentSeo?.title ?? "Default Title",
      description: currentSeo?.description ?? "Default Description",
      url: currentSeo?.url ?? "https://example.com",
      type: "website",
      images: [
        {
          url: currentLocation?.media?.headerLogo ?? "https://example.com/images/fallback.png",
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: currentSeo?.title ?? "Default Title",
      description: currentSeo?.description ?? "Default Description",
      images: [currentLocation?.media?.headerLogo ?? "https://example.com/images/fallback.png"],
    },
    alternates: {
      canonical: currentSeo?.canonical ?? "https://example.com",
      languages: {
        en: "https://example.com/en/page",
        es: "https://example.com/es/page",
      },
    },
    verification: {
      google: "your-google-site-verification-code",
      bing: "your-bing-site-verification-code",
    },
    icons: {
      icon: fav ?? "https://example.com/favicon.ico",
    },
    structuredData: JSON.stringify(structuredData),
  };

  // For client-side rendering (browser)
  if (typeof window !== "undefined") {
    // Dynamically update the document metadata (for client-side)
    document.title = meta.title;

    const metaTags = {
      description: meta.description,
      keywords: meta.keywords,
      viewport: meta.viewport,
      robots: meta.robots,
      "og:title": meta.openGraph.title,
      "og:description": meta.openGraph.description,
      "og:url": meta.openGraph.url,
      "og:type": meta.openGraph.type,
      "og:image": meta.openGraph.images[0]?.url,
      "twitter:card": meta.twitter.card,
      "twitter:title": meta.twitter.title,
      "twitter:description": meta.twitter.description,
      "twitter:image": meta.twitter.images[0],
      "google-site-verification": meta.verification.google,
      "bing-site-verification": meta.verification.bing,
    };

    // Update meta tags dynamically for the browser
    Object.entries(metaTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name='${name}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // Update icons dynamically
    const iconLink = document.querySelector("link[rel='icon']");
    if (iconLink) {
      iconLink.setAttribute("href", meta.icons.icon);
    } else {
      const newIconLink = document.createElement("link");
      newIconLink.setAttribute("rel", "icon");
      newIconLink.setAttribute("href", meta.icons.icon);
      document.head.appendChild(newIconLink);
    }

    // Update canonical links dynamically
    let canonicalTag = document.querySelector("link[rel='canonical']");
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", meta.alternates.canonical);

    // Add structured data dynamically as a script tag
    let structuredDataTag = document.querySelector("script[type='application/ld+json']");
    if (!structuredDataTag) {
      structuredDataTag = document.createElement("script");
      structuredDataTag.setAttribute("type", "application/ld+json");
      document.head.appendChild(structuredDataTag);
    }
    structuredDataTag.textContent = meta.structuredData;
  }

  // Return metadata for server-side rendering (Next.js Head or similar)
  return meta;
}
