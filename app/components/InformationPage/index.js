"use client";

import styles from "./Pricing.module.css";
import { renderComponent } from "../../utils/renderComponent";
import { usePages } from '../../context/PagesContext';
import dynamic from 'next/dynamic';
const ScrollHandler = dynamic(() => import("../ScrollHandler"), { ssr: false });

const Pricing = () => {
  const { pages } = usePages(); // Access pages data from context

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

  const pageName = "information";
  const filtered = filterByPage(pages.pages, pageName);
  console.log('filtered', filtered);
  return (
    <div className={styles.customMargin}>
      <ScrollHandler sectionScroll={null} scrollToCenter={true} />
      <div fluid className="w-full p-0">
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
    </div>
  );
};

export default Pricing;
