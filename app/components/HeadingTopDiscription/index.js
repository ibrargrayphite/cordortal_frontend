"use client";
import React from "react";
import styles from "./HeadingTopDiscription.module.css";

const HeadingTopDiscription = ({ headline, description,className }) => {
  return (
    <div className="container mx-auto mt-10 mb-5 flex justify-center items-center">
      <div className="text-center px-4 ">
        <p className={styles.description}>{description}</p>
        <h2 className={`${styles.headline} max-md:text-base text-[70px] ${className}`}>{headline}</h2>
      </div>
    </div>
  );
};

export default HeadingTopDiscription;
