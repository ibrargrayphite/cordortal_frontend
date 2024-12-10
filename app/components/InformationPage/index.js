"use client";

import styles from "./Pricing.module.css";
import { Container } from "react-bootstrap";
import { renderComponent } from "../../utils/renderComponent";
import ScrollHandler from "../ScrollHandler";
import { usePages } from '../../context/PagesContext';

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

  return (
    <div className={styles.customMargin}>
      <ScrollHandler sectionScroll={null} scrollToCenter={true} />
      <Container fluid className="p-0">
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
      </Container>
    </div>
  );
};

export default Pricing;
