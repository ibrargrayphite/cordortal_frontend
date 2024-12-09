"use client";
import { renderComponent } from "./utils/renderComponent";
import styles from "./Home.module.css";
import { usePages } from "./context/PagesContext";
import { useEffect, useState } from "react";
import { generateCustomMetadata } from "./utils/metadataHelper";

const Home = () => {
  const [isClient, setIsClient] = useState(false);
  const { pages } = usePages(); // Use the pages data from context

  useEffect(() => {
    setIsClient(true);

    (async () => {
      try {
        await generateCustomMetadata(pages,'/');
      } catch (error) {
        console.error("Error generating metadata:", error);
      }
    })();
  }, [pages]);

  if (!isClient) {
    return null; // or return a loading state
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

  const pageName = "Homepage";
  const filtered = filterByPage(pages.pages, pageName);

  return (
    <div className={styles.MarginTopDefault}>
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
