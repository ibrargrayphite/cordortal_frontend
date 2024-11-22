"use client";
import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useRouter } from "next/navigation"; // Import Next.js router
import CustomButton from "../CustomButton";
import styles from "./MediaOverlay.module.css";

const MediaOverlay = ({ media, media2, headline, description, style, src }) => {
  const [loading, setLoading] = useState(true);
  const [mediaError, setMediaError] = useState(false);
  const [mediaType, setMediaType] = useState("video");

  const router = useRouter(); // Use Next.js router

  

  const handlePrimaryAction = () => {
    router.push("/services"); // Use Next.js router for navigation
  };

  const handleSecondaryAction = (src) => {
    window.open(src, "_blank");
  };


  useEffect(() => {
    if (media) {
      // Only attempt autoplay after the video has loaded
      setLoading(false); // Video has finished loading
    }
  }, [loading]); // Trigger when 'loading' changes to false

  return (
    <Container fluid>
      <Row>
        <Col lg={12} sm={12} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div
            className={styles.mediaOverlayContainer}
            style={{
              ...style,
              backgroundImage: loading ? `url(${media2?.src})` : "none", // Show the image while loading
              height: loading || mediaError ? "700px" : "auto",
            }}
          >
            {/* Always visible overlay */}
            <div className={styles.redOverlay}></div>
            {mediaType === "video" ? (
              <video
                id="media-element"
                className={styles.media}
                autoPlay
                muted
                playsInline
                loop
                style={{ display: loading ? "none" : "block" }}
              >
                <source src={media} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                id="media-element"
                src={media}
                alt="media"
                className={styles.media}
                onLoad={handleLoadedData}
                onError={() => {
                  setLoading(false);
                  setMediaError(true);
                }}
                style={{ display: loading ? "none" : "block" }}
              />
            )}

            {/* Overlay Content */}
            <div className={styles.overlayContent}>
              <h1 className={styles.headingTextPrimary}>{headline}</h1>
              {/* <h1 className={styles.headingTextSecondary}>
              Live Better
              </h1> */}
              <p className={styles.descriptionContent}>{description}</p>
              <CustomButton
                headline="View Treatments"
                onClick={handlePrimaryAction}
                className={styles.customButtonFirst}
              />
              <CustomButton
                headline="Book an Appointment"
                onClick={() => handleSecondaryAction(src)}
                className={styles.customButton}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MediaOverlay;
