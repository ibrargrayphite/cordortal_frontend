import { renderComponent } from "../utils/renderComponent";
import { fetchPagesData } from "../utils/fetchPagesData";
import { generateCustomMetadata } from "../utils/metadataHelper";
import ScrollHandler from "../components/ScrollHandler";
import styles from "./AboutUs.module.css";

export async function generateMetadata() {
  const data = await fetchPagesData(); 
  const currentPage = '/about-us'; 
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

const AboutUs = async () => {

  const data = await fetchPagesData();
  const filterByPage = (pages, pageName) => {
    if (!Array.isArray(pages)) {
      return [];
    }

    return pages
      .filter((page) => page.pageName === pageName)
      .map((page) => ({
        ...page,
        content: page.content || [],
      }));
  };

  const pageName = "AboutUs";
  const filtered = filterByPage(data.pages, pageName);

  return (
    <div className={styles.trustedContainer}>
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

export default AboutUs;
