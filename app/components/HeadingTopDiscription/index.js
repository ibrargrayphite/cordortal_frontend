"use client";
import React from "react";
import styles from "./HeadingTopDiscription.module.css";
import { Container } from "react-bootstrap";

const HeadingTopDiscription = ({ headline, description,className }) => {
  return (
    <Container className="mt-10 mb-5 flex justify-center items-center">
      <div className="text-center px-4 ">
        <p className={styles.description}>{description}</p>
        <h1  className={`${styles.headline} max-md:text-base text-[70px] ${className}`}>{headline}</h1>
      </div>
    </Container>
  );
};

export default HeadingTopDiscription;
