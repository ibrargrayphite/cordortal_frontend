"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import CustomButton from "../CustomButton";
import { Container, Row, Col, Card } from "react-bootstrap";
import styles from "./CardRightImage.module.css";
import { FaArrowRight } from "react-icons/fa";

const CardRightImage = ({ description, media, headline }) => {
  const theme = useTheme();
  const router = useRouter();

  const handlePrimaryAction = () => {
    router.push("/services");
  };

  const handleSecondaryAction = (src) => {
    window.open(src, "_blank");
  };

  return (
    <div className="container mx-auto">
      <div
      className="xs:p-4 sm:p-4 md:p-16 md:my-16 xs:my-2 sm:my-2 max-md:text-center justify-center items-center flex max-md:flex-col"
        style={{
          background: theme.mainAccentDark,
          color: theme.textPrimary,
          borderRadius: 25,
          // padding: 70,
          // marginTop: 50,
          // marginBottom: 50,
          position: "relative", // Required for positioning
          overflow: "visible", // Allow elements to overflow the card
        }}
      >
        <div className="items-center flex flex-row max-md:mb-4">
          {/* Left Section */}
          <div className="md:w-7/12 xs:w-full">
            <div>
              <h1 className={styles.headingTextPrimary}>{headline}</h1>
            </div>
            <p className={`${styles.descriptionContent} xs-md:w-full`} >{description}</p>
            <div className="md:flex xs:flex-col md:flex-row gap-3 mt-4">
              <div className="text-center md:mr-4">
              <CustomButton
                headline="Schedule"
                onClick={handlePrimaryAction}
                className={styles.customButtonFirst}
              />
              </div>
              <div className="d-flex justify-center xs:mt-4 md:mt-0 text-center">
                <CustomButton
                  headline="Book Now"
                  onClick={() => handleSecondaryAction(media[0]?.url?.src)}
                  className={styles.customButton}
                  icon={<FaArrowRight />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className={`${styles.imageOverlay} lg:block lg:w-1/2 max-md:w-full`}>
          <img src={media.src} alt="Image" />
        </div>
      </div>
    </div>
  );
};

export default CardRightImage;
