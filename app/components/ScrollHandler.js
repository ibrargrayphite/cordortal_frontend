// ScrollHandler.js
"use client";

import { useEffect } from "react";

const ScrollHandler = ({ sectionScroll }) => {
  useEffect(() => {
    if (sectionScroll) {
      const targetElement = document.getElementById(sectionScroll);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [sectionScroll]);

  return null;
};

export default ScrollHandler;
