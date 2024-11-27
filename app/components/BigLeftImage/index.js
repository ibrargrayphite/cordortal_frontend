"use client";
import React from "react";
import CountUp from "react-countup";
import styles from "./BigLeftImage.module.css";
import { Container } from "react-bootstrap";

const BigLeftImage = ({ title, headline, description, media, media2 }) => {
  return (
    <Container>
      <div className={styles.parent}>
        <div className="container mx-auto py-10">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left Section: Image */}
            <div className="w-full md:w-1/2 flex justify-center relative">
              <img
                src={media.src}
                alt="Big Left"
                // className="rounded-lg shadow-lg max-w-full h-auto"
              />
              <div
                className="absolute  transform rotate-30"
                style={{
                  transform: "translate(145%, -12%) rotate(18deg)",
                }} /* Optional fine-tuning */
              >
                <img
                  src={media2.src}
                  alt="icon overlay"
                  className={styles.iconImage}
                  //   className="w-25 h-25" /* size */
                />
              </div>
            </div>

            {/* Right Section: Heading and Content */}
            <div
              className="w-full md:w-1/2 mt-6 md:mt-0 md:ml-10"
              style={{ padding: "40px 70px 40px 20px" }}
            >
              {/* <p className={styles.title}>{title}</p> */}
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
