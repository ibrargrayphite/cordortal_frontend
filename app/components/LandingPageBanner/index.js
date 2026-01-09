"use client";
import { useRouter } from "next/navigation";
import CustomButton from "../CustomButton";
import { useTheme } from "../../context/ThemeContext";
import styles from "./LandingPageBanner.module.css";

const LandingPageBanner = ({ description , media, headline,headlineLarge,title,buttonName,buttonSrc}) => {
  const theme = useTheme();

  const router = useRouter(); // Use Next.js router

  const handlePrimaryAction = (src) => {
    window.open(src, "_blank");
  };

  const handleSecondaryAction = (src) => {
    window.open(src, "_blank");
  };
  
  return (
        <div className="flex w-100 max-md:justify-center -mt-10 max-md:px-0 p-[70px]" style={{background: theme.mainAccentDark}}>
          <div className="flex flex-wrap justify-center">
             <div className="w-full md:w-1/2 text-center">
              <div className="max-md:container md:p-4 ">
                <div >
                  <h1 className={styles.headingTextPrimary}>{headline}
                  </h1>
                </div>
                <p className={styles.descriptionContent}>{description}</p>
                <div className="flex xs:flex-col md:flex-row justify-center items-center">
                {buttonSrc && (
                  <CustomButton
                    headline={buttonName ? buttonName : "Book Now"}
                    onClick={() => handlePrimaryAction(buttonSrc)}
                    className={styles.customButtonFirst}
                  />
                )}
                {src && (
                  <CustomButton
                    headline="Get Started"
                    onClick={() => handleSecondaryAction(src)}
                    className={styles.customButton}
                  />
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default LandingPageBanner;
