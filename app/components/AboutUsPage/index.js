"use client";

import { renderComponent } from "../../utils/renderComponent";
import styles from "./AboutUs.module.css";
import { usePages } from '../../context/PagesContext';
import dynamic from 'next/dynamic';
const ScrollHandler = dynamic(() => import("../ScrollHandler"), { ssr: false });

const AboutUs = () => {
  const { pages } = usePages(); // Use context to get pages data

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

  const pageName = "about-us";
  const filtered = filterByPage(pages.pages, pageName); // Use context data

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
