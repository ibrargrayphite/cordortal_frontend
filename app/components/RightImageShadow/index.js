"use client";
import React from "react";
import styles from "./RightImageShadow.module.css";
import { Container, Row, Col } from "react-bootstrap";
import CustomButton from "../CustomButton";
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "next/navigation";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import Image from "next/image";

const RightImageShadow = ({ headline, description, media,buttonName,buttonSrc }) => {
  const theme = useTheme();
  const router = useRouter(); // Use Next.js router

  const handlePrimaryAction = (src) => {
    window.open(src, "_blank");
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
            headline={buttonName ? buttonName : "Book Now"}
            onClick={() => handlePrimaryAction(buttonSrc)}
            className={styles.customButtonFirst}
          />
        </div>
        </Col>

        {/* Right Section: Image with shadow/reflection */}
        <Col xs={9} md={6} className="d-flex justify-content-center">
          <div className={styles.imageWrapper}>
            <Image 
            loading="lazy"
            width={100} height={100}
              src={media && media?.startsWith('https') ? media : defaultMedia.src}
              alt="Right Section"
              className="img-fluid w-full h-auto"
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RightImageShadow;
