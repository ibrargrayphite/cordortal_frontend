"use client";
import styles from "./FinanceCard.module.css";
import { Button } from "../ui/button";

const FinanceCard = ({ buttonSrc, headline, description }) => {
  const handleFinanceClick = (src) => {
    window.open(src, "_blank");
  };

  return (
    <div className="container lg:max-w-[960px] xxl:max-w-[960px] mx-auto">
      <div className={`${styles.cardParent} flex flex-col py-4 px-8 mt-8 md:mt-20 lg:mt-20`}>
          <p className={styles.cardHeading}>{headline}</p>
          <p className={styles.cardDescription}>{description}</p>
          <div className="w-full flex justify-center items-center">
          <Button
            onClick={() => handleFinanceClick(buttonSrc)}
            className={`${styles.customNavbarBtn} bg-main-accent`}
            style={{ width: 211, marginLeft: "14px", marginBottom: "10px" }}
            variant="default"
            size="default"
          >
            Let's Start
          </Button>
          </div>
        </div>
    </div>
  );
};

export default FinanceCard;
