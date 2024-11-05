import { Container, Row, Col } from "react-bootstrap";
import styles from "./SimpleImageGallery.module.css";
const SimpleImageGallery = ({ media, noBgColor = true }) => {
  return (
    <Container fluid className={noBgColor ? styles.noBgColor : styles.bgColor}>
      <Container>
        <Row>
          {media &&
            media.map((service, index) => (
              <Col sm key={index}>
                <img
                  src={service.image.src}
                  style={{ width: "100%", height: "auto" }}
                  alt="Dental services image gallery featuring happy patients"
                />
              </Col>
            ))}
        </Row>
      </Container>
    </Container>
  );
};

export default SimpleImageGallery;
