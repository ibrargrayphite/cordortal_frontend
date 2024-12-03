"use client";
import styles from "./Emergency.module.css";
import { Container } from "react-bootstrap";
import { renderComponent } from "../utils/renderComponent";
import { usePages } from '../context/PagesContext';
import { useEffect, useState } from 'react';
import { generateCustomMetadata } from "../utils/metadataHelper";

const Emergency = () => {
  const [isClient, setIsClient] = useState(false);
  const { pages } = usePages();

  useEffect(() => {
    setIsClient(true);

    (async () => {
      try {
        await generateCustomMetadata(pages,'/emergency');
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

  const pageName = "emergency";
  const filtered = filterByPage(pages.pages, pageName);

  return (
    <Container fluid="sm" className={styles.MarginTopDefault}>
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
