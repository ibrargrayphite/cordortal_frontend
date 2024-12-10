"use client";

import styles from "./Team.module.css";
import { renderComponent } from "../../utils/renderComponent";
import ScrollHandler from "../ScrollHandler";
import { usePages } from '../../context/PagesContext';

const TeamPage = () => {
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

export default TeamPage;
