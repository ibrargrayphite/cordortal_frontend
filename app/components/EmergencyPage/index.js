"use client";

import { Container } from "react-bootstrap";
import { renderComponent } from "../../utils/renderComponent";
import { usePages } from '../../context/PagesContext';
import styles from "./Emergency.module.css";
import dynamic from 'next/dynamic';
const ScrollHandler = dynamic(() => import("../ScrollHandler"), { ssr: false });

const Emergency = () => {
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

  const pageName = "emergency";
  const filtered = filterByPage(pages.pages, pageName);

  return (
    <Container fluid="sm" className={styles.MarginTopDefault}>
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
        <p>No locations found.</p>
      )}
    </Container>
  );
};

export default Emergency;
