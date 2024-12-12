"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./Trusted.module.css";
import { Col, Container, Row } from "react-bootstrap";
import CustomButton from "../CustomButton";
import rightArrow from "../../../public/assets/images/right-arrow.png";
import HtmlContent from "../HtmlContent";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";

const LeftImage = ({ media, description, htmlContent, isIconButton = false }) => {
  const router = useRouter();
  const mediaSource = media && media?.startsWith('https') ? media : defaultMedia.src;

  // Handle navigation to the contact page
  const handlePrimaryAction = () => {
    router.push("/contact-us");
  };

  return (
    <div>
      <Container>
        <Row className={styles.section2}>
          <Col md={6} xs={12} className={styles.headerGroup2}>
            <Image loading="lazy" className={styles.leftimageWidth} src={mediaSource} alt="providing exceptional dental care with a focus on innovation, comfort, and patient satisfaction" style={{width:"70%"}} width={100} height={350} />
          </Col>
          <Col md={6} xs={12}>
            {description ? (
              <p className={styles.paragraph}>{description}</p>
            ) : (
              <HtmlContent htmlContent={htmlContent} />
            )}

            <div className={styles.buttonContainer}>
              <CustomButton
                headline={"Let’s Start"}
                onClick={handlePrimaryAction}
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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LeftImage;
