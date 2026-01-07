"use client";

import { renderComponent } from "../../utils/renderComponent";
import styles from "./LocationCard.module.css";
import { usePages } from '../../context/PagesContext';
import dynamic from 'next/dynamic';
const ScrollHandler = dynamic(() => import("../ScrollHandler"), { ssr: false });

const LocationCard = ({currentPageName}) => {
  const { pages } = usePages(); // Use context to get pages data
  console.log('locations pages======>>>>', pages);
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

  const pageName = currentPageName || "locations";
  const filtered = filterByPage(pages.pages, pageName); // Use context data
  console.log('filtered locations======>>>>', filtered);

  return (
    <div className={styles.trustedContainer}>
      <ScrollHandler sectionScroll={null} scrollToCenter={false} />
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

export default LocationCard;
