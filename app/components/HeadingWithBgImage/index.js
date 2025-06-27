import { Col, Container, Row } from "react-bootstrap";
import styles from "./HeadingWithBgImage.module.css";
import defaultMedia from "../../../public/assets/images/home/SOLUTIONS.png";

import Image from "next/image";
const HeadingWithBgImage = ({
  headline,
  media,
  withoutBgImageHeading = false,
  description,
  anchorTextEnd,
  telephoneNumber,
  showAnchorCall = false,
  noBgColor = true,
  headlineLarge = false,
}) => {
  const mediaSource = media && media?.startsWith('https') ? media : defaultMedia.src;

  return (
    <>
      {withoutBgImageHeading ? (
        <Container fluid="sm">
          <p className={headlineLarge ? styles.HeadlineLarge : styles.Headline} dangerouslySetInnerHTML={{ __html: headline }} />
          <Row>
            <Col />
            <Col lg={9} sm={12}>
              <p className={styles.text}>
                {description}{" "}
                {showAnchorCall && (
                  <span>
                    <a href={`${telephoneNumber}`}>{anchorTextEnd}</a>
                  </span>
                )}
              </p>
            </Col>
            <Col />
          </Row>
        </Container>
      ) : (
        <Container
          fluid
          className={noBgColor ? styles.noBgColor : styles.bgColor}
        >
          <Container>
            <div
              className={
                headlineLarge
                  ? styles.headingContainerLarge
                  : styles.headingContainer
              }
            >
              <Image   
                loading="eager"
                layout="responsive"
                priority={true} 
                width={100} 
                height={100} 
                src={mediaSource} 
                alt={headline} 
                className={styles.bgImage}
              />
              <h2
                className={
                  headlineLarge ? styles.overlayText2 : styles.overlayText
                }
                dangerouslySetInnerHTML={{ __html: headline }}
              />
            </div>
            <Row>
              <Col />
              <Col lg={9} sm={12}>
                <p
                  className={
                    description ? styles.textImage : styles.textImageHide
                  }
                >
                  {description}{" "}
                  {showAnchorCall && (
                    <span>
                      <a href={`${telephoneNumber}`}>{anchorTextEnd}</a>
                    </span>
                  )}
                </p>
              </Col>
              <Col />
            </Row>
          </Container>
        </Container>
      )}
    </>
  );
};

export default HeadingWithBgImage;
