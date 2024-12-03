"use client";
import { useEffect, useState } from "react";
import styles from "./Blogs.module.css";
import { renderComponent } from "../utils/renderComponent";
import { usePages } from '../context/PagesContext'; // Import the usePages hook
import { generateCustomMetadata } from "../utils/metadataHelper";


const Blogs = () => {
  const [isClient, setIsClient] = useState(false);
  const { pages } = usePages();

  useEffect(() => {
    setIsClient(true);

    (async () => {
      try {
        await generateCustomMetadata(pages,'/blogs');
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
  const pageName = "blogs";
  const filtered = filterByPage(pages.pages, pageName);

  return (
    <div className={styles.customMargin}>
      {filtered.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.content.map((block, blockIndex) => (
            <div key={blockIndex} id={block.scroll}>
              {renderComponent(block)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Blogs;
