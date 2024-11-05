// "use client";
// import { useEffect, useState } from "react";
import styles from "./Blogs.module.css";
import currentLocation from "../data";
import { renderComponent } from "../utils/renderComponent";
// SEO configuration
const SEO_CONFIG = currentLocation.SEO_CONFIG || {};
const currentSeo = SEO_CONFIG['/blogs'];

// export async function generateMetadata() {
//   return {
//     title: currentSeo.title,
//     description: currentSeo.description,
//     keywords: currentSeo.keywords,
//     image: "https://example.com/images/services.png", // Update with a relevant image
//     url: currentSeo.canonical,
//   };
// }
export async function generateMetadata() {
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
    // icons: [
    //   { rel: "icon", href: "/favicon.ico" },
    //   { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
    //   { rel: "manifest", href: "/site.webmanifest" },
    // ],
    structuredData: JSON.stringify(structuredData),
  };
}
const Blogs = () => {
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  // const [filteredLocations, setFilteredLocations] = useState([]);

  const filterByPage = (currentLocation, pageName) => {
    const { pages } = currentLocation;

    if (!Array.isArray(pages)) {
      return [];
    }

    return pages
      .filter((page) => page.pageName === pageName)
      .map((page) => ({
        ...page,
        content: page.content || [] // Ensure content exists
      }));
  };
  const pageName = "blogs";
  const filtered = filterByPage(currentLocation, pageName);


  // useEffect(() => {
  //   const pageName = "blogs";

  //   const filtered = filterByPage(currentLocation, pageName);
  //   setFilteredLocations(filtered);
  // }, []);
  return (
    <div className={styles.customMargin}>
      {filtered.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.content.map((block, blockIndex) => (
            <div key={blockIndex} id={block.scroll}>
              {renderComponent(block)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Blogs;
