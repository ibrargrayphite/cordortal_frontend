"use client";
import styles from "./Services.module.css";
import { renderComponent } from "../utils/renderComponent";
import { usePages } from '../context/PagesContext'; // Import the usePages hook
import { useEffect, useState } from 'react';
import { generateCustomMetadata } from "../utils/metadataHelper";
import ScrollHandler from "../components/ScrollHandler";


const Services = () => {
  const [isClient, setIsClient] = useState(false);
  const { pages } = usePages();

  useEffect(() => {
    setIsClient(true);

    (async () => {
      try {
        await generateCustomMetadata(pages,'/services');
      } catch (error) {
        console.error("Error generating metadata:", error);
      }
    })();
  }, [pages]);

  if (!isClient) {
    return null;
  }

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

  const pageName = "services";
  const filtered = filterByPage(pages.pages, pageName);

  return (
    <div className={styles.customMargin}>
        <ScrollHandler sectionScroll={null} scrollToCenter={true} />
        {filtered.length > 0 ? (
          filtered.map((page, pageIndex) => (
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
    </div>
  );
};

export default Services;
