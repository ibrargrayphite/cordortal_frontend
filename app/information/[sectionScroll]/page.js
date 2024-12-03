import styles from "../Pricing.module.css";
import { renderComponent } from "../../utils/renderComponent";
import ScrollHandler from "../../components/ScrollHandler";
import { fetchPagesData } from '../../utils/fetchPagesData'; // Adjust the path accordingly
import { generateCustomMetadata } from "../../utils/metadataHelper";

// Generates static paths for each service
export async function generateStaticParams() {
  const pageName = "information";
  // Fetch dynamic data from the API
  const data = await fetchPagesData();
  const filteredLocations = filterByPage(data, pageName);


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

// Generate dynamic metadata based on blog slug
export async function generateMetadata({ params }) {
  const { sectionScroll } = params;
  const data = await fetchPagesData();
  const currentPage = `/${sectionScroll}`;
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

const Pricing = async ({ params }) => {
  const { sectionScroll } = params;

  const pageName = "information";
  const data = await fetchPagesData();
  const filteredLocations = filterByPage(data, pageName);
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
