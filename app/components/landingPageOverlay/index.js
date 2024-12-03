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
        height: "100vh", 
      }}
    >
      <Container className="p-0 d-flex align-items-center" style={{ height: "100%" }}>
        <div className="flex w-100 justify-content-between">
          {/* Left Section */}
          <div className="w-1/2 p-4 d-flex flex-column justify-content-center">
            <div >
              <h1 className={styles.headingTextPrimary}>{headline}
              <span className={styles.bold}>{headlineLarge}</span>
              </h1>
              <h1 className={styles.headingTextPrimary} >{title}</h1>
            </div>
            <p className={styles.descriptionContent}>{description}</p>
            <div className="d-flex">
            <CustomButton
              headline="Book Now"
              onClick={handlePrimaryAction}
              className={styles.customButtonFirst}
            />
            <CustomButton
              headline="Get Started"
              onClick={() => handleSecondaryAction(src)}
              className={styles.customButton}
            />
            </div>
          </div>

          {/* Right Section (Image Cards) */}
          <div className="w-1/2 d-flex ">
            <div className="overflow-hidden rounded-md mr-4 w-full">
              <img
                className="w-full h-70 object-cover rounded-md"
                src={media[0].url.src}
                alt="Image 1"
              />
            </div>
            <div className=" rounded-md mr-4 w-full">
              <img
                className="w-full h-100 object-cover rounded-md"
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
      </Container>
    </div>
  );
};

export default landingPageOverlay;
