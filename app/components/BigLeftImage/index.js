"use client";
import React from "react";
import CountUp from "react-countup";
import styles from "./BigLeftImage.module.css";
import { Container } from "react-bootstrap";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import Image from "next/image";

const BigLeftImage = ({ title, headline, description, media, media2 }) => {
  return (
    <Container>
      <div className={styles.parent}>
        <div className="container mx-auto py-10">
          <div className="d-md-flex flex-col md:flex-row items-center">
            {/* Left Section: Image */}
            <div className="col-12 col-md-6 flex justify-center relative">
              <Image
              loading="lazy"
                src={media && media?.startsWith('https') ? media : defaultMedia.src}
                alt="Big Left"
                width={100} height={100}
                className={styles.Bigleft}
              />
              <div
                className="absolute  transform rotate-30 d-none d-xl-block"
                style={{
                  transform: "translate(145%, -12%) rotate(18deg)",
                }}
              >
                <Image
                loading="lazy"
                  src={media2 && media2?.startsWith('https') ? media2 : defaultMedia.src}
                  alt="icon overlay"
                  className={styles.iconImage}
                  width={100} height={100}
                />
              </div>
            </div>

            {/* Right Section: Heading and Content */}
            <div
              className="col-12 col-md-6  mt-6 md:mt-0 md:py-8 md:pl-6 md:pr-16"
              // style={{ padding: "40px 70px 40px 20px" }}
            >
              <p className={styles.title}>{title}</p>
              <h2 className={`display-5 display-sm-3 display-md-2 display-lg-1 display-xl-1 ${styles.headline}`}>{headline}</h2>
              <p className={styles.description}>{description}</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BigLeftImage;
