"use client";

import { renderComponent } from "../../utils/renderComponent";
import styles from "./Plans.module.css";
import { usePages } from '../../context/PagesContext';
import dynamic from 'next/dynamic';
const ScrollHandler = dynamic(() => import("../ScrollHandler"), { ssr: false });

const Plans = () => {
  const { pages } = usePages();

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

  // Group consecutive PlanCard blocks together (similar to how ServiceCard receives all services in one block)
  const groupConsecutivePlanCards = (content) => {
    const grouped = [];
    let planCardGroup = [];
    
    content.forEach((block) => {
      if (block.component === "PlanCard") {
        planCardGroup.push(block);
      } else {
        // If we have accumulated PlanCard blocks, add them as a group
        if (planCardGroup.length > 0) {
          grouped.push({
            type: "planCardGroup",
            blocks: [...planCardGroup],
            scroll: planCardGroup[0]?.scroll
          });
          planCardGroup = [];
        }
        grouped.push(block);
      }
    });
    
    // Don't forget the last group if content ends with PlanCard blocks
    if (planCardGroup.length > 0) {
      grouped.push({
        type: "planCardGroup",
        blocks: [...planCardGroup],
        scroll: planCardGroup[0]?.scroll
      });
    }
    
    return grouped;
  };

  const pageName = "plans";
  const filtered = filterByPage(pages.pages, pageName);

  return (
    <div className={styles.trustedContainer}>
      <ScrollHandler sectionScroll={null} scrollToCenter={false} />
      {filtered.length > 0 ? (
        filtered.map((page, pageIndex) => {
          const groupedContent = groupConsecutivePlanCards(page.content);
          
          return (
            <div key={pageIndex}>
              {groupedContent.map((item, blockIndex) => {
                if (item.type === "planCardGroup") {
                  // Combine all plans from consecutive PlanCard blocks into one plans array
                  // This mimics how ServiceCard receives all services in one block
                  const combinedPlans = item.blocks.map(block => ({
                    id: block.id,
                    planName: block.planName,
                    price: block.price,
                    headline: block.headline,
                    description: block.description,
                    content: block.content
                  }));
                  
                  // Create a single block with all plans (like ServiceCard receives services array)
                  const combinedBlock = {
                    ...item.blocks[0],
                    plans: combinedPlans
                  };
                  
                  return (
                    <div key={`planGroup-${blockIndex}`} id={item.scroll}>
                      {renderComponent(combinedBlock)}
                    </div>
                  );
                } else {
                  return (
                    <div key={blockIndex} id={item.scroll}>
                      {renderComponent(item)}
                    </div>
                  );
                }
              })}
            </div>
          );
        })
      ) : (
        <p>No content available.</p>
      )}
    </div>
  );
};

export default Plans;