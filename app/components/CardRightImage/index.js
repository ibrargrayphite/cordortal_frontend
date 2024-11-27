"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import CustomButton from "../CustomButton";
import { Container, Row, Col, Card } from "react-bootstrap";
import styles from "./CardRightImage.module.css";
import { FaArrowRight } from "react-icons/fa";

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
          position: "relative", // Required for positioning
          overflow: "visible", // Allow elements to overflow the card
          display: "flex",
          flexDirection: "row"
        }}
      >
        <Row className="align-items-center">
          {/* Left Section */}
          <Col md={7}>
            <div>
              <h1 className={styles.headingTextPrimary}>{headline}</h1>
            </div>
            <p className={styles.descriptionContent}>{description}</p>
            <div className="d-flex gap-3 mt-4">
              <CustomButton
                headline="Schedule"
                onClick={handlePrimaryAction}
                className={styles.customButtonFirst}
              />
              <CustomButton
                headline="Book Now 1"
                onClick={() => handleSecondaryAction(media[0]?.url?.src)}
                className={styles.customButton}
                icon={<FaArrowRight />}
              />
            </div>
          </Col>
        </Row>

        {/* Right Section (Image) */}
        <div className={styles.imageOverlay}>
          <img src={media.src} alt="Image" />
        </div>
      </Card>
    </Container>
  );
};

export default CardRightImage;
