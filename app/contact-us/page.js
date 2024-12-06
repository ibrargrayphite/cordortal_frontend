"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Contact.module.css";
import { renderComponent } from "../utils/renderComponent";
import { usePages } from '../context/PagesContext';
import { generateCustomMetadata } from "../utils/metadataHelper";
import ScrollHandler from "../components/ScrollHandler";

const ContactUs = () => {
  const [isClient, setIsClient] = useState(false);
  const { pages } = usePages(); // Use the pages data from context

  useEffect(() => {
    setIsClient(true);

    (async () => {
      try {
        await generateCustomMetadata(pages,'/contact-us');
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

  const pageName = "contactus";
  const filtered = filterByPage(pages.pages, pageName);

  return (
    <div className={styles.customMargin}>
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

export default ContactUs;
