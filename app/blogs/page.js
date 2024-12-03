// "use client";
// import { useEffect, useState } from "react";
import styles from "./Blogs.module.css";
import currentLocation from "../data";
import { renderComponent } from "../utils/renderComponent";
// SEO configuration
const SEO_CONFIG = currentLocation.SEO_CONFIG || {};
const currentSeo = SEO_CONFIG['/blogs'];
const fav = currentLocation?.favIcon.src

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
    "name": currentSeo?.title ?? 'need seo title',
    "description": currentSeo?.description ?? "need seo description",
    "url": currentSeo?.url ?? "need seo url",
    "image": currentLocation?.media?.headerLogo ?? "need seo image",
  };

  return {
    title: currentSeo?.title ?? 'need seo title',
    description: currentSeo?.description ?? "need seo description",
    keywords: currentSeo?.keywords ?? "need seo keywords",
    viewport: "width=device-width, initial-scale=1",
    robots: "index, follow",
    openGraph: {
      title: currentSeo?.title ?? 'need seo title',
      description: currentSeo?.description ?? "need seo description",
      url: currentSeo?.url ?? "need seo url",
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
      title: currentSeo?.title ?? 'need seo title',
      description: currentSeo?.description ?? "need seo description",
      images: [currentLocation?.media?.headerLogo ?? "https://example.com/images/fallback.png"],
    },
    alternates: {
      canonical: currentSeo?.canonical ?? "https://yourwebsite.com",
      languages: {
        "en": "https://yourwebsite.com/en/page",
        "es": "https://yourwebsite.com/es/page",
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
