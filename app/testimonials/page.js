import { Container } from "react-bootstrap";
import styles from "./Testimonials.module.css";
import { renderComponent } from "../utils/renderComponent";
import currentLocation from "../data";

// SEO configuration
const SEO_CONFIG = currentLocation.SEO_CONFIG || {};
const currentSeo = SEO_CONFIG['/testimonials'];

// export async function generateMetadata() {
//   return {
//     title: currentSeo.title,
//     description: currentSeo.description,
//     keywords: currentSeo.keywords,
//     image: "https://example.com/images/testimonials.png", // Update with a relevant image
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

const Testimonials = () => {
  // Function to filter locations based on the page name
  const filterByPage = (locationData, pageName) => {
    const { pages } = locationData;

    if (!Array.isArray(pages)) {
      return [];
    }

    return pages
      .filter((page) => page.pageName === pageName)
      .map((page) => ({
        ...page,
        content: page.content || [], // Ensure content exists
      }));
  };

  const pageName = "testimonials"; // Specify the page name to filter by
  const filteredLocations = filterByPage(currentLocation, pageName);

  return (
    <div className={styles.marginCustom}>
      <Container>
        {filteredLocations.length > 0 ? (
          filteredLocations.map((page, pageIndex) => (
            <div key={pageIndex}>
              {page.content && page.content.length > 0 ? (
                page.content.map((block, blockIndex) => (
                  <div key={blockIndex} id={block.scroll}>
                    {renderComponent(block)}
                  </div>
                ))
              ) : (
                <p>No content available for this section.</p>
              )}
            </div>
          ))
        ) : (
          <p>No locations found.</p>
        )}
      </Container>
    </div>
  );
};

export default Testimonials;
