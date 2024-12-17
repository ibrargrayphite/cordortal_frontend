import { Container, Row, Col } from "react-bootstrap";
import styles from "./SimpleImageGallery.module.css";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import Image from "next/image";

const SimpleImageGallery = ({ media, noBgColor = true }) => {

  return (
    <Container fluid className={noBgColor ? styles.noBgColor : styles.bgColor}>
      <Container>
        <Row>
          {media &&
            media.map((service, index) => (
              <Col sm key={index}>
                <Image 
                loading="lazy"
                  width={100} height={100}
                  src={service.image && service.image?.startsWith('https') ? service.image : defaultMedia.src}
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
