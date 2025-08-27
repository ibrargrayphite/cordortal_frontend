"use client";
import React from "react";
import styles from "./RightImageShadow.module.css";
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
    <div className="container lg:max-w-[960px] xxl:max-w-[1320px] mx-auto py-5">
      <div className="flex flex-wrap items-center justify-center g-0">
        {/* Left Section */}
        <div className="w-full md:w-1/2 text-center text-md-start">
        <div className="lg:pl-20 md:p-0 lg:pr-8">
          <h2 className={styles.headline}>{headline}</h2>
          <p className={styles.description}>{description}</p>
          <CustomButton
            headline={buttonName ? buttonName : "Book Now"}
            onClick={() => handlePrimaryAction(buttonSrc)}
            className={styles.customButtonFirst}
          />
        </div>
        </div>

        {/* Right Section: Image with shadow/reflection */}
        <div className="w-9/12 md:w-1/2 flex justify-center">
          <div className={styles.imageWrapper}>
            <Image 
            loading="lazy"
            width={100} height={100}
              src={media && media?.startsWith('https') ? media : defaultMedia.src}
              alt="Right Section"
              className="img-fluid w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightImageShadow;
