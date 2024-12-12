import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './BeforeAfterTreatment.module.css';
import Image from "next/image";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";

const BeforeAfterTreatment = ({ mediaBefore, mediaAfter, noBgColor }) => {
  const mediaSourceBefore = mediaBefore && mediaBefore?.startsWith('https') ? mediaBefore : defaultMedia.src;
  const mediaSourceAfter = mediaAfter && mediaAfter?.startsWith('https') ? mediaAfter : defaultMedia.src;

  return (
    <div className={noBgColor ? styles.noBgColor : styles.solutionsContainer0}>
      <Container className={styles.beforeAfterContainer}>
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={4} className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <Image loading="lazy" src={mediaSourceBefore} width={100} height={100} alt="Before treatment image highlighting teeth discoloration and gaps" className={styles.imgFluid} />
              <div className={styles.overlayText}>Before</div>
            </div>
          </Col>
          <Col xs={12} md={4} className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <Image loading="lazy" src={mediaSourceAfter} width={100} height={100} alt="After treatment image showcasing whiter teeth and closed gaps" className={styles.imgFluid} />
              <div className={styles.overlayText}>After</div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BeforeAfterTreatment;
