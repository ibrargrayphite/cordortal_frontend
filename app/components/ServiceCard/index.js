"use client";

import { Container, Row, Col } from "react-bootstrap";
import styles from "./ServiceCard.module.css"; // Assuming you have styles for your component
import { useRouter } from "next/navigation";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import Image from "next/image";

const ServiceCard = ({
  services,
  noBgColor = true,
  noClickableCard = true,
}) => {
  const router = useRouter();

  return (
    <div className={noBgColor ? styles.noBgColor : styles.solutionsContainer0}>
      <Container className={styles.servicesParent}>
        <Row>
          {services &&
            services.map((service, index) => (
              <Col
                key={index}
                sm={12}
                lg={4}
                className={noClickableCard ? "" : styles.solutionsCol}
                onClick={() => {
                  if (!noClickableCard) {
                    router.push(`/services/${service?.slug}`);
                  }
                }} // Disable navigation if noBgColor is true
              >
                <div className={styles.solutionIcons}>
                  <Image 
                  priority={true}
                    width={100} 
                    height={116}
                    src={service.media && service.media?.startsWith('https') ? service.media : defaultMedia.src}
                    className={styles.imageSize}
                    alt={`${service.headline}`}
                  />
                </div>
                <Container>
                  <h3 className={styles.solutionsTitle}>{service.headline}</h3>
                  <h4 className={styles.sectionText}>
                    <ul className={styles.noBullets}>
                      {service?.bullets?.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li> // Rendering bullet points dynamically
                      ))}
                    </ul>
                  </h4>
                  <h5 className={styles.sectionDescription}>
                    {service.description}
                  </h5>
                </Container>
              </Col>
            ))}
        </Row>
      </Container>
    </div>
  );
};

export default ServiceCard;
