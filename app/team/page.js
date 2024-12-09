"use client";
import styles from "./Team.module.css";
import { renderComponent } from "../utils/renderComponent";
import { usePages } from '../context/PagesContext';
import { useEffect, useState } from 'react';
import { generateCustomMetadata } from "../utils/metadataHelper";
import ScrollHandler from "../components/ScrollHandler";

const Team = () => {
  const [isClient, setIsClient] = useState(false);
  const { pages } = usePages();

  useEffect(() => {
    setIsClient(true);

    (async () => {
      try {
        await generateCustomMetadata(pages,'/team');
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

  const pageName = "team";
  const filtered = filterByPage(pages.pages, pageName);

  return (
    <div className={styles.marginCustom}>
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

export default Team;
