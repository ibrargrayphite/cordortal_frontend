"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import CustomButton from "../CustomButton";
import { Container, Row, Col, Card } from "react-bootstrap";
import styles from "./CardRightImage.module.css";
import { FaArrowRight } from "react-icons/fa";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";

const CardRightImage = ({ description, media, headline }) => {
  const theme = useTheme();
  const router = useRouter();

  const handlePrimaryAction = () => {
    router.push("/services");
  };

  const handleSecondaryAction = (src) => {
    window.open(src, "_blank");
  };

  return (
    <Container>
      <Card
        style={{
          background: theme.mainAccentDark,
          color: theme.textPrimary,
          borderRadius: 25,
          padding: 70,
          marginTop: 50,
          marginBottom: 50,
          position: "relative",
          overflow: "visible",
          display: "flex",
          flexDirection: "row"
        }}
      >
        <Row className="align-items-center">
          {/* Left Section */}
          <Col md={7}>
            <div>
              <h2 className={styles.headingTextPrimary}>{headline}</h2>
            </div>
            <p className={styles.descriptionContent}>{description}</p>
            <div className="d-flex gap-3 mt-4">
              <CustomButton
                headline="Schedule"
                onClick={handlePrimaryAction}
                className={styles.customButtonFirst}
              />
              <CustomButton
                headline="Book Now"
                onClick={() => handleSecondaryAction(media[0]?.url?.src)}
                className={styles.customButton}
                icon={<FaArrowRight />}
              />
            </div>
          </Col>
        </Row>

        {/* Right Section (Image) */}
        <div className={styles.imageOverlay}>
          <img src={media && media?.startsWith('https') ? media : defaultMedia.src} alt="Image" />
        </div>
      </Card>
    </Container>
  );
};

export default CardRightImage;
