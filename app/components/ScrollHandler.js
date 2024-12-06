// ScrollHandler.js
"use client";

import { useEffect } from "react";

const ScrollHandler = ({ sectionScroll, scrollToCenter = false }) => {
  useEffect(() => {
    if (sectionScroll) {
      const targetElement = document.getElementById(sectionScroll);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    } else if (scrollToCenter) {
      // Get current scroll position
      const currentScroll = window.scrollY;
      const centerY = window.innerHeight / 2;

      // Scroll to top if already near the center
      if (Math.abs(currentScroll - centerY) <= 50) {
        // If within a threshold of the center, scroll to top
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        // Otherwise, scroll to the center
        window.scrollTo({
          top: centerY,
          behavior: "smooth",
        });
      }
    }
  }, [sectionScroll, scrollToCenter]);

  return null;
};

export default ScrollHandler;
