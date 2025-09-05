"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./Trusted.module.css";
import CustomButton from "../CustomButton";
import rightArrow from "../../../public/assets/images/right-arrow.png";
import HtmlContent from "../HtmlContent";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";

const LeftImage = ({ media, description, htmlContent, isIconButton = false,src }) => {
  const router = useRouter();
  const mediaSource = media && media?.startsWith('https') ? media : defaultMedia.src;

  // Handle navigation to the contact page
  const handlePrimaryAction = (src) => {
    if(src){
      window.open(src,"_blank")
    }else{
      router.push("/contact-us");
    }
  };

  return (
    <div>
      <div className="container mx-auto w-full lg:max-w-[960px] xxl:max-w-[1320px]">
        <div className={`${styles.section2} flex flex-wrap`}>
          <div className={`${styles.headerGroup2} w-full md:w-1/2 md:pr-3`}>
            <Image
              loading="lazy"
              className={styles.leftimageWidth}
              src={mediaSource}
              alt="providing exceptional dental care with a focus on innovation, comfort, and patient satisfaction"
              width={100}
              height={350}
            />
          </div>

         
          <div className="w-full md:w-1/2 md:pl-3">
            {description ? (
              <p className={styles.paragraph}>{description}</p>
            ) : (
              <HtmlContent htmlContent={htmlContent} />
            )}

            <div className={styles.buttonContainer}>
              <CustomButton
                headline={"Let’s Start"}
                onClick={()=>handlePrimaryAction(src)}
                className={styles.customButtonFirst}
              />
              {isIconButton && (
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                    cursor: "pointer",
                    width: "100%",
                  }}
                  className={styles.appointment}
                  onClick={() => router.push("/about-us")}
                >
                  <button className={styles.button2}>Read more</button>
                  <Image
                    loading="lazy"
                    src={rightArrow}
                    alt="rightArrow"
                    height={11}
                    width={11}
                    className={styles.rightArrowAlign}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftImage;
