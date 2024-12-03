import styles from "../Pricing.module.css";
import { renderComponent } from "../../utils/renderComponent";
import currentLocation from "../../data";
import ScrollHandler from "../../components/ScrollHandler";

// Generates static paths for each service
export async function generateStaticParams() {
  const pageName = "information";
  const filteredLocations = filterByPage(currentLocation, pageName);


  // contentArray Logic to handle scrolling behavior for content sections based on slug presence:
  // - For some components, we scroll directly to the component using its root-level 'slug'.
  // - For other components, we may need to scroll to a specific item within the nested 'data' list, which contains individual slugs.
  // This code extracts content with slugs from both the root level and nested 'data' arrays using flatMap to combine results into a single array.
  // else we are using harcoded list if both root level item.slug or item.[data].slug not found


  const contentArray = filteredLocations.length > 0 
    ? filteredLocations[0].content.flatMap(item => {
        if (item.slug) {
            // Root-level slug exists
            return item;
        } else if (item.data && Array.isArray(item.data)) {
            // Check if nested slugs exist in the data array
            return item.data.filter(dataItem => !!dataItem.slug);
        }
        return [];
    })
    : [];


  // If no content data is available, fallback to hardcoded data
  const finalContentArray = contentArray.length > 0 
    ? contentArray 
    : [
        { slug: "section-1" },
        { slug: "section-2" },
        { slug: "section-3" },
        // Add more hardcoded sections here as needed
      ];

  return finalContentArray.map((item) => ({
    sectionScroll: item.slug,
  }));
}


// Set revalidation interval for ISR
export const revalidate = 60; // Revalidate every 60 seconds

// SEO configuration
const SEO_CONFIG = currentLocation.SEO_CONFIG || {};
const currentSeo = SEO_CONFIG['/information'];
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
    "image": currentLocation?.media?.headerLogo ?? "https://example.com/images/fallback.png",
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

const Pricing = async ({ params }) => {
  const { sectionScroll } = params;

  const pageName = "information";
  const filteredLocations = filterByPage(currentLocation, pageName);
  const contentArray = filteredLocations.length > 0 ? filteredLocations[0].content : [];

  return (
    <div className={styles.customMargin}>
      <ScrollHandler sectionScroll={sectionScroll} />
      {contentArray.map((block, blockIndex) => (
        <div key={blockIndex} id={block.slug}>
          {renderComponent(block)}
        </div>
      ))}
    </div>
  );
};

// Helper function to filter data
function filterByPage(locationData, pageName) {
  const { pages } = locationData;
  if (!Array.isArray(pages)) return [];
  return pages.filter((page) => page.pageName === pageName).map((page) => ({
    ...page,
    content: page.content || [],
  }));
}

export default Pricing;
