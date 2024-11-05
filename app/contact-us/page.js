"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Contact.module.css";
import { renderComponent } from "../utils/renderComponent";
import currentLocation from "../data";

const ContactUs = () => {
  const { param } = useParams();
  const [filteredLocations, setFilteredLocations] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0); // Scroll to top on mount
    }
  }, []);

  const scrollToSection = (path) => {
    const sectionIds = {
      "/about-us/team": "aboutTeam",
    };

    const sectionId = sectionIds[path];
    if (sectionId) {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        scrollToSection(window.location.pathname); // Use window.location.pathname
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  const filterByPage = (locationData, pageName) => {
    const { pages } = locationData;

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

  useEffect(() => {
    const pageName = "contactus";
    const filtered = filterByPage(currentLocation, pageName);
    setFilteredLocations(filtered);
  }, []);

  return (
    <div className={styles.customMargin}>
      {filteredLocations.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.content.map((block, blockIndex) => (
            <div key={blockIndex} id={block.scroll}>
              {renderComponent(block)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ContactUs;
