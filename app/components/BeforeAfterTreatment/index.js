import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './BeforeAfterTreatment.module.css';
import Image from "next/image";

const BeforeAfterTreatment = ({ mediaBefore, mediaAfter, noBgColor }) => {
  return (
    <div className={noBgColor ? styles.noBgColor : styles.solutionsContainer0}>
      <Container className={styles.beforeAfterContainer}>
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={4} className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <Image src={mediaBefore} alt="Before treatment image highlighting teeth discoloration and gaps" className={styles.imgFluid} />
              <div className={styles.overlayText}>Before</div>
            </div>
          </Col>
          <Col xs={12} md={4} className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <Image src={mediaAfter} alt="After treatment image showcasing whiter teeth and closed gaps" className={styles.imgFluid} />
              <div className={styles.overlayText}>After</div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BeforeAfterTreatment;
