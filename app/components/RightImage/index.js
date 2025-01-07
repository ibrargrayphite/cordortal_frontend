
"use client";
import styles from "./Trusted.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import CustomButton from "../CustomButton";
import Image from "next/image";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
const RightImage = ({
  icon,
  mediaBefore,
  mediaAfter,
  description,
  media,
  buttonSrc,
  isIconButton = false,
}) => {

  const mediaSourceBefore = mediaBefore && mediaBefore?.startsWith('https') ? mediaBefore : defaultMedia.src;
  const mediaSourceAfter = mediaAfter && mediaAfter?.startsWith('https') ? mediaAfter : defaultMedia.src;
  const router = useRouter();
  const handlePrimaryAction = (path) => {
    if(path) {
      window.open(path, "_blank");
    }
    else {
      router.push("/contact-us");
    }
  };
  return (
    <div>
      <Container>
        <Row style={{alignItems: media?'center':'none'}}>
          <Col md={6} xs={12}>
            <p className={styles.paragraph}>{description}</p>
            <div className={styles.buttonContainer}>
              <CustomButton
                headline={"Let’s Start"}
                onClick={()=>handlePrimaryAction(buttonSrc)}
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
                  loading="lazy"
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
            {media ? (
              <Image
                loading="lazy"
                src={media}
                height={11}
                width={100}
                className={styles.rightPlainImg}
                alt="Learn more about our dental care options"
              />
            ) : (
              <div className={styles.heartContainer}>
                <div className={styles.leftSide}>
                  <div className={styles.halfHeart1}>
                    {" "}
                    <Image
                      loading="lazy"
                      src={mediaSourceBefore}
                      width={100}
                      height={100}
                      alt="mediaBefore"
                    />
                  </div>
                  <div className={styles.halfHeart2}></div>
                </div>
                <div className={styles.rightSide}>
                  <div className={styles.halfHeart3}></div>
                  <div className={styles.halfHeart4}>
                    <Image
                      loading="lazy"
                      src={mediaSourceAfter}
                      width={100}
                      height={100}
                      alt="mediaAfter"
                    />
                  </div>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RightImage;
