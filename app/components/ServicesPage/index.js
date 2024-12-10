"use client";

import styles from "./Services.module.css";
import { renderComponent } from "../../utils/renderComponent";
import ScrollHandler from "../ScrollHandler";
import { usePages } from '../../context/PagesContext';

const Services = () => {
  const { pages } = usePages(); // Access data from context

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
