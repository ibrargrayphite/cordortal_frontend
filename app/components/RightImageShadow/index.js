"use client";
import React from "react";
import styles from "./RightImageShadow.module.css";
import { Container, Row, Col } from "react-bootstrap";
import CustomButton from "../CustomButton";
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "next/navigation";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";

const RightImageShadow = ({ headline, description, media }) => {
  const theme = useTheme();
  const router = useRouter(); // Use Next.js router

  const handlePrimaryAction = () => {
    router.push("/services"); // Use Next.js router for navigation
  };

  return (
    <Container className="py-5">
      <Row className="items-center justify-center g-0">
        {/* Left Section */}
        <Col xs={12} md={6} className="text-center text-md-start">
        <div className="lg:pl-20 md:p-0 lg:pr-8">
          <h2 className={styles.headline}>{headline}</h2>
          <p className={styles.description}>{description}</p>
          <CustomButton
            headline="Book Now"
            onClick={handlePrimaryAction}
            className={styles.customButtonFirst}
          />
        </div>
        </Col>

        {/* Right Section: Image with shadow/reflection */}
        <Col xs={9} md={6} className="d-flex justify-content-center">
          <div className={styles.imageWrapper}>
            <img
              src={media && media?.startsWith('https') ? media : defaultMedia.src}
              alt="Right Section"
              className="img-fluid"
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RightImageShadow;
