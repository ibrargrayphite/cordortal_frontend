import { renderComponent } from "./utils/renderComponent";
import styles from "./Home.module.css";
import { fetchPagesData } from "./utils/fetchPagesData";
import { generateCustomMetadata } from "./utils/metadataHelper";
import ScrollHandler from "./components/ScrollHandler";

// Generate metadata
export async function generateMetadata() {
  // Fetch data once and use it for metadata
  const data = await fetchPagesData();
  const currentPage = '/';
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

// Home component
const Home = async () => {
  // Fetch data once and reuse it for content and metadata
  const data = await fetchPagesData();
  
  // Filter pages by pageName
  const filterByPage = (pages, pageName) => 
    Array.isArray(pages) ? 
    pages.filter(page => page.pageName === pageName).map(page => ({
      ...page,
      content: page.content || [],
    })) : [];

  const filtered = filterByPage(data.pages, "Homepage");

  return (
    <div className={styles.MarginTopDefault}>
      <ScrollHandler sectionScroll={null} scrollToCenter={true} />
      {filtered.length > 0 ? (
        filtered.map((page, pageIndex) => (
          <div key={pageIndex}>
            {page.content.map((block, blockIndex) => (
              <div key={blockIndex} id={block.scroll}>
                {renderComponent(block)}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No content available.</p>
      )}
    </div>
  );
};

export default Home;
