"use client";
import React from "react";
import CountUp from "react-countup";
import styles from "./BigLeftImage.module.css";
import { Container } from "react-bootstrap";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";

const BigLeftImage = ({ title, headline, description, media, media2 }) => {
  return (
    <Container>
      <div className={styles.parent}>
        <div className="container mx-auto py-10">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left Section: Image */}
            <div className="w-full md:w-1/2 flex justify-center relative">
              <img
                src={media && media?.startsWith('https') ? media : defaultMedia.src}
                alt="Big Left"
              />
              <div
                className="absolute  transform rotate-30"
                style={{
                  transform: "translate(145%, -12%) rotate(18deg)",
                }}
              >
                <img
                  src={media2 && media2?.startsWith('https') ? media2 : defaultMedia.src}
                  alt="icon overlay"
                  className={styles.iconImage}
                />
              </div>
            </div>

            {/* Right Section: Heading and Content */}
            <div
              className="w-full md:w-1/2 mt-6 md:mt-0 md:ml-10"
              style={{ padding: "40px 70px 40px 20px" }}
            >
              <p className={styles.title}>{title}</p>
              <h2 className={styles.headline}>{headline}</h2>
              <p className={styles.description}>{description}</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BigLeftImage;
