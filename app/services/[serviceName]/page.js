import { fetchPagesData } from '../../utils/fetchPagesData'; // Adjust the path accordingly
import styles from "./ServiceDetail.module.css";
import { renderComponent } from "../../utils/renderComponent";
import { generateCustomMetadata } from '../../utils/metadataHelper';

// Generates static paths for each service
export async function generateStaticParams() {
  const pageName = "services";
  const data = await fetchPagesData();
  const filteredLocations = filterByPage(data, pageName);

  const contentArray = filteredLocations.length > 0 ? filteredLocations[0].content : [];
  const serviceCardData = contentArray.find((block) => block.component === "ServiceCard");
  const allServices = serviceCardData?.services || [];

  const finalServiceArray = allServices.length > 0 
    ? allServices 
    : [
        { slug: "service-1" },
        { slug: "service-2" },
        { slug: "service-3" },
      ];

  // Return all the services' slugs as params
  return finalServiceArray.map((service) => ({
    serviceName: service.slug,
  }));
}

// Set revalidation interval for ISR
export const revalidate = 60; // Revalidate every 60 seconds

// Generate dynamic metadata based on blog slug
export async function generateMetadata({ params }) {
  const { serviceName } = params;
  const data = await fetchPagesData();
  const currentPage = `/${serviceName}`;
  const meta = await generateCustomMetadata(data, currentPage);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    robots: meta.robots,
    openGraph: meta.openGraph,
    twitter: meta.twitter,
    alternates: meta.alternates,
    verification: meta.verification,
    icons: meta.icons,
    structuredData: meta.structuredData,
  };
}

const ServiceDetail = async ({ params }) => {
  const { serviceName } = params;
  // Fetch dynamic data from the API
  const data = await fetchPagesData();
  const pageName = "services";
  const filteredLocations = filterByPage(data, pageName);
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
