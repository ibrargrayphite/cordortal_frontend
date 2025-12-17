"use client";

import { renderComponent } from "../../utils/renderComponent";
import styles from "./Home.module.css";
import { usePages } from '../../context/PagesContext';
import dynamic from 'next/dynamic';
const ScrollHandler = dynamic(() => import("../ScrollHandler"), { ssr: false });

// Home Component
const Home = () => {
  const { pages } = usePages(); // Use context to get pages data
  // Filter pages by pageName
  const filterByPage = (pages, pageName) => 
    Array.isArray(pages) ? 
    pages.filter(page => page.pageName === pageName).map(page => ({
      ...page,
      content: page.content || [],
    })) : [];

  const filtered = filterByPage(pages.pages, "Homepage"); // Use context data
  console.log('homePage', filtered)
  return (
    <div>
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

export default Home;
