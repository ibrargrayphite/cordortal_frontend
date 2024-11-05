import styles from "./ServiceDetail.module.css";
import { renderComponent } from "../../utils/renderComponent";
import currentLocation from "../../data";

// Generates static paths for each service
export async function generateStaticParams() {
  const pageName = "services";
  const filteredLocations = filterByPage(currentLocation, pageName);

  const contentArray = filteredLocations.length > 0 ? filteredLocations[0].content : [];
  const serviceCardData = contentArray.find((block) => block.component === "ServiceCard");
  const allServices = serviceCardData?.services || [];

  return allServices.map((service) => ({
    serviceName: service.slug,
  }));
}

// Set revalidation interval for ISR
export const revalidate = 60; // Revalidate every 60 seconds

// SEO configuration
const SEO_CONFIG = currentLocation.SEO_CONFIG || {};
// const currentSeo = SEO_CONFIG['/services'];

// export async function generateMetadata({params}) {
//   const { serviceName } = params;
//   const currentSeo = SEO_CONFIG[`/${serviceName}`] || {};

//   return {
//     title: currentSeo.title,
//     description: currentSeo.description,
//     keywords: currentSeo.keywords,
//     image: "https://example.com/images/services.png", // Update with a relevant image
//     url: currentSeo.canonical,
//   };
// }
export async function generateMetadata({params}) {
    const { serviceName } = params;
  const currentSeo = SEO_CONFIG[`/${serviceName}`] || {};
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

const ServiceDetail = async ({ params }) => {
  const { serviceName } = params;

  const pageName = "services";
  const filteredLocations = filterByPage(currentLocation, pageName);
  const contentArray = filteredLocations.length > 0 ? filteredLocations[0].content : [];
  const serviceCardData = contentArray.find((block) => block.component === "ServiceCard");
  const allServices = serviceCardData?.services || [];
  const specificService = allServices.find((service) => service.slug === serviceName);

  if (!specificService) {
    return <div>Service not found.</div>;
  }

  return (
    <div className={styles.customMargin}>
      {specificService.content.map((block, blockIndex) => (
        <div key={blockIndex} id={block.scroll}>
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

export default ServiceDetail;
