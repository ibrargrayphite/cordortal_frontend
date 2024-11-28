"use client";
import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import CustomButton from "../CustomButton";
import { useTheme } from "../../context/ThemeContext";
import pageoverlay1 from "../../../public/assets/images/straightSmile/pageoverlay1.png";
import pageoverlay2 from "../../../public/assets/images/straightSmile/pageoverlay2.png";
import pageoverlay3 from "../../../public/assets/images/straightSmile/pageoverlay3.png";



import styles from "./landingPageOverlay.module.css";

const landingPageOverlay = ({ description , media, headline,headlineLarge,title}) => {
  const theme = useTheme();

  const router = useRouter(); // Use Next.js router

  const handlePrimaryAction = () => {
    router.push("/services"); // Use Next.js router for navigation
  };

  const handleSecondaryAction = (src) => {
    window.open(src, "_blank");
  };
  
  return (
    <div
      style={{
        background: theme.mainAccentDark,
        minHeight: "100vh", 
        paddingBottom: '6rem'
      }}
      className="flex items-center"
    >
      <div className="container" style={{ height: "100%" }}>
        <div className="lg:flex w-full justify-content-between h-full items-center">
          {/* Left Section */}
          <div className="lg:w-1/2 p-4 flex flex-col justify-center">
            <div >
              <h1 className={styles.headingTextPrimary}>{headline}
              <span className={`${styles.bold} `} >{headlineLarge}</span>
              </h1>
              <h1 className={styles.headingTextPrimary} >{title}</h1>
            </div>
            <p className={styles.descriptionContent}>{description}</p>
            <div className="flex flex-wrap max-md:items-center max-md:justify-center">
              <div className="me-2 mb-2">
                <CustomButton
                  headline="Book Now"
                  onClick={handlePrimaryAction}
                  className={styles.customButton}
                />
              </div>
              <div className="mb-2">
                <CustomButton
                  headline="Get Started"
                  onClick={() => handleSecondaryAction(src)}
                  className={styles.customButton}
                />
              </div>
            </div>
          </div>

          {/* Right Section (Image Cards) */}
          <div className="lg:w-1/2 flex xs:p-4 sm:p-4 lg:p-0">
            <div className="overflow-hidden rounded-md mr-4 w-full">
              <img
                className="w-full h-70 object-cover rounded-md"
                src={media[0].url.src}
                alt="Image 1"
              />
            </div>
            <div className=" rounded-md mr-4 w-full">
              <img
                className="w-full h-full object-cover rounded-md"
                src={media[1].url.src}
                alt="Image 2"
              />
            </div>
            <div className=" rounded-md mr-4 w-full d-flex items-end">
              <img
                className="w-full h-70 object-cover rounded-md"
                src={media[2].url.src}
                alt="Image 3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default landingPageOverlay;
