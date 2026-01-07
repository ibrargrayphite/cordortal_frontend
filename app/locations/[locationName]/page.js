import { fetchPagesData } from '../../utils/fetchPagesData';
import styles from "./LocationDetail.module.css";
import { renderComponent } from "../../utils/renderComponent";
import { generateCustomMetadata } from '../../utils/metadataHelper';
import dynamic from 'next/dynamic';
const ScrollHandler = dynamic(() => import("../../components/ScrollHandler"));

// Generates static paths for each location
export async function generateStaticParams() {
  try {
    const data = await fetchPagesData();
    const pageName = "locations";
    const filteredPages = filterByPage(data, pageName);
    
    // Find LocationCard component in the page content
    const contentArray = filteredPages.length > 0 ? filteredPages[0].content : [];
    const locationCardData = contentArray.find((block) => block.component === "LocationCard");
    const allLocations = locationCardData?.locations || [];

    // Filter out disabled locations and ensure they have slugs
    const validLocations = allLocations
      .filter(location => location.slug && !location.disable)
      .map((location) => ({
        locationName: location.slug,
      }));

    // If no valid locations found, provide fallback
    if (validLocations.length === 0) {
      return [
        { locationName: 'default' },
      ];
    }

    return validLocations;
  } catch (error) {
    console.error('Error generating static params for locations:', error);
    return [
      { locationName: 'default' },
    ];
  }
}

// Set revalidation interval for ISR
export const revalidate = 60;

// Generate dynamic metadata based on location slug
export async function generateMetadata({ params }) {
  const { locationName } = params;
  const currentPage = `/locations/${locationName}`;
  const meta = await generateCustomMetadata(currentPage);

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

const LocationDetail = async ({ params }) => {
  const { locationName } = params;
  
  // Fetch dynamic data from the API
  const data = await fetchPagesData();
  const pageName = "locations";
  const filteredPages = filterByPage(data, pageName);
  
  // Find LocationCard component in the page content
  const contentArray = filteredPages.length > 0 ? filteredPages[0].content : [];
  const locationCardData = contentArray.find((block) => block.component === "LocationCard");
  const allLocations = locationCardData?.locations || [];
  
  // Find the specific location by slug
  const specificLocation = allLocations.find(
    (location) => location.slug === locationName && !location.disable
  );

  if (!specificLocation) {
    return <div>Service not found.</div>;
  }

  return (
    <div className={styles.customMargin}>
      <ScrollHandler sectionScroll={null} scrollToCenter={true} />
      {specificLocation?.content?.map((block, blockIndex) => (
        <div key={blockIndex} id={block.scroll}>
          {renderComponent(block)}
        </div>
      ))}
    </div>
  );
};

// Helper function to filter data by pageName
function filterByPage(locationData, pageName) {
  const { pages } = locationData;
  if (!Array.isArray(pages)) return [];
  return pages.filter((page) => page.pageName === pageName)?.map((page) => ({
    ...page,
    content: page.content || [],
  }));
}
export default LocationDetail;