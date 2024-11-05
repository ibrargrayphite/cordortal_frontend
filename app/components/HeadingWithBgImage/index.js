import { Col, Container, Row } from "react-bootstrap";
import styles from "./HeadingWithBgImage.module.css";

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
  return (
    <>
      {withoutBgImageHeading ? (
        <Container fluid="sm">
          <p className={headlineLarge ? styles.HeadlineLarge : styles.Headline}>
            {headline}
          </p>
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
              <img src={media.src} alt={headline} className={styles.bgImage} />
              <h2
                className={
                  headlineLarge ? styles.overlayText2 : styles.overlayText
                }
              >
                {headline}
              </h2>
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
