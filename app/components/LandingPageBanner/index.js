"use client";
import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import CustomButton from "../CustomButton";
import { useTheme } from "../../context/ThemeContext";
import styles from "./LandingPageBanner.module.css";

const LandingPageBanner = ({ description , media, headline,headlineLarge,title}) => {
  const theme = useTheme();

  const router = useRouter(); // Use Next.js router

  const handlePrimaryAction = () => {
    router.push("/services"); // Use Next.js router for navigation
  };

  const handleSecondaryAction = (src) => {
    window.open(src, "_blank");
  };
  
  return (
        <div className="flex w-100 max-md:justify-center -mt-10 max-md:px-0" style={{background: theme.mainAccentDark,padding:"70px"}}>
          <Row className="justify-content-center">
             <Col md={6} sm={12} className="text-center">
              <div className="p-4 ">
                <div >
                  <h1 className={styles.headingTextPrimary}>{headline}
                  </h1>
                </div>
                <p className={styles.descriptionContent}>{description}</p>
                <div className="d-flex justify-center xs:flex-col md:flex-row justify-center items-center">
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
            </Col>
          </Row>
        </div>
  );
};

export default LandingPageBanner;
