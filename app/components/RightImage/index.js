
"use client";
import styles from "./Trusted.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import CustomButton from "../CustomButton";
import Image from "next/image";

const RightImage = ({
  icon,
  mediaBefore,
  mediaAfter,
  description,
  isIconButton = false,
}) => {
  const router = useRouter();
  const handlePrimaryAction = () => {
    router.push("/contact-us");
  };
  return (
    <div>
      <Container>
        <Row >
          <Col md={6} xs={12}>
            <p className={styles.paragraph}>{description}</p>
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
                    width: "-webkit-fill-available",
                  }}
                  className={styles.appointment}
                  onClick={() => router.push("/about-us")}
                >
                  <button className={styles.button2}>{"Read more"}</button>
                  <Image
                    src={icon}
                    height={11}
                    className={styles.rightArrowAlign}
                    alt="Learn more about our dental care options"
                  />
                </div>
              )}
            </div>
          </Col>
          <Col md={6} xs={12}>
            <div className={styles.heartContainer}>
              <div className={styles.leftSide}>
                <div className={styles.halfHeart1}> <Image src={mediaBefore} alt="mediaBefore"/></div>
                <div className={styles.halfHeart2}></div>
              </div>
              <div className={styles.rightSide}>
                <div className={styles.halfHeart3}></div>
                <div className={styles.halfHeart4}><Image src={mediaAfter} alt="mediaAfter"/></div>
              </div>
            </div>
            </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RightImage;
