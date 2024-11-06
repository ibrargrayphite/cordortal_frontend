import styles from "../Pricing.module.css";
import { renderComponent } from "../../utils/renderComponent";
import currentLocation from "../../data";
import ScrollHandler from "../../components/ScrollHandler";

// Generates static paths for each service
export async function generateStaticParams() {
  const pageName = "information";
  const filteredLocations = filterByPage(currentLocation, pageName);

  const contentArray = filteredLocations.length > 0 ? filteredLocations[0].content.filter(item=>!!item.slug) : [];
  

  return contentArray.map((item) => ({
    sectionScroll: item.slug,
  }));
}

// Set revalidation interval for ISR
export const revalidate = 60; // Revalidate every 60 seconds

// SEO configuration
const SEO_CONFIG = currentLocation.SEO_CONFIG || {};
const currentSeo = SEO_CONFIG['/information'];

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
