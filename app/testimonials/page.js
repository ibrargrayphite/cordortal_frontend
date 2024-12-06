"use client";
import { Container } from "react-bootstrap";
import styles from "./Testimonials.module.css";
import { renderComponent } from "../utils/renderComponent";
import { usePages } from '../context/PagesContext';
import { useEffect, useState } from 'react';
import { generateCustomMetadata } from "../utils/metadataHelper";
import ScrollHandler from "../components/ScrollHandler";

const Testimonials = () => {
  const [isClient, setIsClient] = useState(false);
  const { pages } = usePages();

  useEffect(() => {
    setIsClient(true);

    (async () => {
      try {
        await generateCustomMetadata(pages,'/testimonials');
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

  const pageName = "testimonials";
  const filtered = filterByPage(pages.pages, pageName);

  return (
    <div className={styles.marginCustom}>
      <Container>
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
      </Container>
    </div>
  );
};

export default Testimonials;
